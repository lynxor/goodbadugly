## Cell Point

Installing
----------

Just run

    npm install

It will download all dependencies for the project.

Running

    npm test

runs the tests


Running

    npm start

will start the server on port 8080

Guard'ing
---------
I have implemented an automated test runner using guard and libnotify. Install the following gems:

     gem install guard
     gem install guard-shell
     gem install libnotify

And then run guard in the toplevel dir. This should start the file watcher, and everytime a file changes the tests will be ran, and you will be notified using libnotify (on linux) with the status of the tests.

Note: it may be necessary to "npm install mocha -g" as root to get the mocha binary on the path.

  

