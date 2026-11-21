# Prompt To Web App

**🔗 Live gallery: [ekaddo.github.io/Prompt-To-Web-App](https://ekaddo.github.io/Prompt-To-Web-App/)**

Browse every app in this repo as a live gallery — each entry pairs a working demo with the prompt (or
reverse-engineered prompt) behind it, so you can paste it into any online or local model and compare
the result.

Sandbox for various prompts to web apps.

## Adding a new app

1. Create a folder under `Web Apps/<app-name>/` containing the app's `.html` file and a `.md` file with
   the prompt (written up front, or reverse-engineered from the finished app).
2. Add an entry to the `APPS` array near the top of the `<script>` in [index.html](index.html):

   ```js
   {
     title: "App Title",
     summary: "One or two sentences describing it.",
     tags: ["Tech", "Used"],
     swatch: ["#111", "#222"], // optional preview colors
     folder: "Web Apps/<app-name>",
     demo: "app-file.html",
     prompt: "prompt-file.md"
   }
   ```
