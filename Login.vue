<template>
   <div class="row">
          <!-- /.col -->
          <div class="col-xs-4">
            <google-signin-btn label="Sign In with Google" customClass="my-button" @click="signin"/>
            <a id="signout-button" @click="signout()">Sign out</a>
          </div>

          <!-- /.col -->
        </div>
        <a @click="create()">new file</a>
        <a @click="seeFile()">see file</a>
        <a @click="deleteF()">delete file</a>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters, mapActions } from "vuex";
import router from "../router";
import Vue from "vue";
import VueGoogleApi from "vue-google-api";

var found = 0;
var file_id = "";

export default {
  name: "GoogleAPI",
  data() {
    return {
      isInit: false,
      isSignIn: false,
      username: "",
      password: "",
      loading: false,
      message: "Sign in to start your session",
      activeColor: "",
      oauthToken: null
    };
  },
  created() {
    this.loading = true;
    this.isSigned();
  },
  mounted() {
    this.toggleBodyClass("addClass", "login-page");
  },
  destroyed() {
    this.toggleBodyClass("removeClass", "login-page");
  },
  methods: {
    signin: function() {
       var vueHelper = this 
       vueHelper.message = 'Logging in...'
      this.$gapi
        .signIn()
        .then(user => {
          console.log("Signed in as %s", user.name);
          vueHelper.$router.push("/Main");
        })
        .catch(err => {
          console.error("Not signed in: %s", err.error);
        });
    },
    isSigned: function() {
       var vueHelper = this 
      this.$gapi.isSignedIn().then(result => {
        console.log(result ? "Signed in" : "Signed out");
        if(result)
        vueHelper.$router.push("/Main");
      });
    },
    currentuser: function() {
      this.$gapi.currentUser().then(user => {
        if (user) {
          console.log("Signed in as %s", user.name);
        } else {
          console.log("No user is connected.");
        }
      });
    },
    signout: function() {
      this.$gapi.signOut().then(() => {
        console.log("User disconnected.");
      });
    },
    create: function() {
      this.checkIfFileExists("configs.txt");
    },
    deleteF: function() {
      this.checkIfFileExists("configs.txt");
      this.deleteFile(file_id);
    },
    seeFile: function() {
      this.seeFiles();
    },
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
    deleteFile: function(id) {
      this.$gapi
        .request({
          path: "upload/drive/v3/files/" + id,
          method: "DELETE",
          params: { fileId: id }
        })
        .then(response => {
          console.log(response);
          console.log("Updated file in your google drive");
        })
        .catch(err => {
          console.error("Request error: %s");
          console.log(err);
        });
    },
    toggleLoading: function() {
      this.loading = this.loading === "" ? "loading" : "";
    },
    resetResponse: function() {
      this.response = "";
    },
    toggleBodyClass(addRemoveClass, className) {
      const el = document.body;

      if (addRemoveClass === "addClass") {
        el.classList.add(className);
      } else {
        el.classList.remove(className);
      }
    },
    mounted() {
      let that = this;
      let checkGauthLoad = setInterval(function() {
        that.isInit = that.$gAuth.isInit;
        that.isSignIn = that.$gAuth.isAuthorized;
        if (that.isInit) clearInterval(checkGauthLoad);
      }, 1000);
    }
  }
};
</script>

<style>
.my-button {
  background-color: #eee;
}
.my-button span.text {
  color: red;
}
</style> 
