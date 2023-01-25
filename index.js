#!/usr/bin/env node
const spawn = require('child_process').spawn;
const chokidar = require('chokidar');
const path = require('path');


class Nodekeeper {
    constructor() {
        this.__init__();
    }


    __init__ = () => {
        // this.args = process.argv;
        // this.fileName = this.args[2];
        this.cwd = process.cwd();
        this.watchPaths = [
            path.join(this.cwd, "/**/*.go"),
            path.join(this.cwd, "/*.go")
        ];
        console.log(this.watchPaths)
        // this.ignoredPaths = "**/node_modules/*";


        this.reload();
        this.startWatching();
        this.listeningEvents();
    }


    reload = () => {
        if (this.nodeServer) {
            console.log('\x1b[31m%s\x1b[0m', "Killing running server.....")
            // this.nodeServer.kill('SIGTERM')
            spawn("taskkill", ["/pid", this.nodeServer.pid, '/f', '/t']);
        };


        console.log('\x1b[32m%s\x1b[0m',"Starting server.....")
        this.nodeServer = spawn('go', ['run', '.'], { stdio: [process.stdin, process.stdout, process.stderr] });
    }


    startWatching = () => {
        chokidar.watch(this.watchPaths, {
            ignored: this.ignoredPaths,
            ignoreInitial: true
        }).on('all', (event, path) => {
            this.reload();
        });
    }


    listeningEvents = () => {
        // listening on CLI input
        console.log("Inside Listening Events")
        process.stdin.on("data", (chunk) => {
            let cliInput = chunk.toString();
            console.log("Input Entered", cliInput)

            switch (cliInput) {
                case 'rs\n':
                    this.reload();
                    break
            }
        });
    }

}

new Nodekeeper();