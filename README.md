# Vue.js-Script-to-use-Google-API
Script to use one simple Vue.Js plugin and do google sign-in and insert files in google drive

## Getting started

### Prerequisites
First you will need to install the vue-google-api plugin from https://www.npmjs.com/package/vue-google-api 

## To do the Google Sign-in
```
 signin: function() {
     this.$gapi
        .signIn()
        .then(user => {
          console.log("Signed in as %s", user.name);
          
        })
        .catch(err => {
          console.error("Not signed in: %s", err.error);
        });
    }
```
## To do the Google Sign-out
```
 signout: function() {
      this.$gapi.signOut().then(() => {
        console.log("User disconnected.");
      });
    }
```
## See all Files in Google Drive of that google accoutn already signed-in
```
seeFiles: function file() {
      this.$gapi
        .request({
          path: "drive/v3/files",
          method: "GET",
          params: { maxResults: "1" }
        })
        .then(response => {
          var i = 0;

          console.log("File names:");

          response.result.files.forEach(function(file) {
            console.log(file.name);
          });
        })
        .catch(err => {
          console.error("Request error: " + err);
          //console.log(err);
        });
    }
```

## New File (with content)
Check if a file with that name already exists if it does, update it with new content, if not, create new.
```
 create: function() {
      this.checkIfFileExists("configs.txt");
    },
    
 checkIfFileExists: function(name) {
      this.$gapi
        .request({
          path: "drive/v3/files",
          method: "GET",
          params: { maxResults: "1" }
        })
        .then(response => {
          response.result.files.forEach(function(file) {
            if (file.name == name) {
              console.log("Already exists file with that name");
              file_id = file.id;
              found = 1;
            }
          });
          if (found == 1) this.updateFile(file_id, "Edit");
          else this.newFile(name, "Config Builder");
        });
    },
     updateFile: function(id, text) {
      this.$gapi
        .request({
          path: "upload/drive/v3/files/" + id,
          method: "PATCH",
          params: { uploadType: "media" },
          body: text
        })
        .then(response => {
          console.log(response);
          console.log("File deleted");
        })
        .catch(err => {
          console.error("Request error: %s");
          console.log(err);
        });
    },
    newFile: function insertFile(name, text) {
      const boundary = "-------314159265358979323846";
      //const boundary = "--------53170215682661314146";
      const delimiter = "\r\n--" + boundary + "\r\n";
      const close_delim = "\r\n--" + boundary + "--";

      var mimeType = "text/plain";
      var metadata = {
        name: name,
        mimeType: "text/plain\r\n\r\n"
      };

      var multipartRequestBody =
        delimiter +
        "Content-Type: application/json\r\n\r\n" +
        JSON.stringify(metadata) +
        delimiter +
        "Content-Type: application/json\r\n\r\n" +
        text +
        close_delim;

      this.$gapi
        .request({
          path: "upload/drive/v3/files",
          method: "POST",
          params: { uploadType: "multipart" },
          headers: {
            "Content-Type": 'multipart/related; boundary="' + boundary + '"'
          },
          body: multipartRequestBody
        })
        .then(response => {
          console.log(response);
          console.log("Created new file in your google drive");
        })
        .catch(err => {
          console.error("Request error: %s");
          console.log(err);
        });
    },
    
```


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
