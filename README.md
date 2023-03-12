# blank_deno_blog
a blank deno blog!

1. ☝️☝️☝️ ~> click "Use this template" to create a new repo with these files, in your account.  You can change the name, just be sure to remember what you named it - we will need that in a few steps.
2. Make sure you have [git](https://git-scm.com/) installed.
3. Using terminal (macOS) or PowerShell (Windows), navigate the location on your computer where you would like to put your blog repository:
   -  `pwd` will give you the present working directory
   -  `cd ..` moves you out to the parent folder
   -  `cd folder_name` moves you into the folder `folder_name`, providing such a folder exists in your current location
4. Type `git clone https://github.com/your_username/your_reponame`, where `your_username` is your username, and `your_reponame` is whatever name you gave the new repository in step 1. 
5. This should create a local repository in a folder with that name, in your current location. Use `cd` to navigate into that folder.
6. Make sure you have [VS Code](https://code.visualstudio.com/) installed.
7. In the terminal, type `open .` to open to that location in Finder (macOS), or `ii .` to open it in Windows Explorer.
8. Back in the terminal, type `code .` to open that folder in VS Code (you might need to add `code` to `PATH`: press `cmd` + `shift` + `P`, type `PATH`, and select `Shell Command: Install 'code' command in PATH`).
9. Make sure you have [Deno](https://deno.land/) installed.
10. Back in the terminal, type `deno task dev` to start serving your blog locally.  Navigate to `http://localhost:8000/` (or similar - see Deno's output in the terminal) in a browser to view it.  The server will automatically update the page when you make changes to the blog, although you may need to refresh.
11. Make changes to the blog!  
   - In VS Code, change the values next to `title`, `description`, and `author` in `main.tsx`.  Bonus points if you can figure out how to change the `avatar` image.
   - Make a new `.md` file in the `posts` folder with similar front matter to the existing markdown file called `hello_world.md`.  We will be using [markdown](https://www.markdownguide.org/cheat-sheet/) to write our blog posts!
12. Save your files to view the changes on your browser.
13. Push to those changes to the GitHub repository with:
    -  `git add .`
    -  `git commit -m 'description of changes'`
    -  `git push`
14. Sign into [deno deploy](https://deno.com/deploy) with your GitHub credentials.
15. Click "New Project"
16. Click on "Select Github repository"
17. Select your GitHub username.
18. Select the repository containing your blog.
19. Click "Select production branch".
20. Select "main".
21. Select "automatic".
22. Select "main.tsx".
23. Click "Link". 
24. Click "View" to go to the URL where your blog is now live.
25. Whenever you make changes to your blog in your local repository, repeat step `13` to push the changes to GitHub, which will now automatically update the online version of your blog via Deno Deploy.

