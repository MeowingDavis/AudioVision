/** @jsx h */

import blog, { ga, redirects, h } from "blog";

blog({
  title: "DangerLine",
  description: "Davis Lang",
  // header: <header>AudioVision</header>,
  // section: <section><a>PLAY HERE</a></section>,
  // footer: <footer>Your custom footer</footer>,
  avatar: "./img/Designer.png",
  avatarClass: "rounded-full",
  author: "Davis Lang",

  // middlewares: [

    // If you want to set up Google Analytics, paste your GA key here.
    // ga("UA-XXXXXXXX-X"),

    // If you want to provide some redirections, you can specify them here,
    // pathname specified in a key will redirect to pathname in the value.
    // redirects({
    //  "/hello_world.html": "/hello_world",
    // }),

  // ]
});
