# Other resources
* [slides](https://drive.google.com/a/gooddata.com/file/d/0B7-tmN0Y4DN3bzdZcVYteXF2MG8/view?usp=sharing)
* [overview of our demo cluster](http://104.155.56.136/)

# Setup instructions
1. clone this repo
2. run ``./setup.sh`` - it downloads and configures ``kubectl`` (the command-line utility for Kubernetes)
3. the setup script will also print a command to open a tunnel to kubernetes API @ our cluster - run it in a separate terminal & keep the tunnel open
4. you should be ready to rock - to test things out, try running ``kubectl get pods`` - you shouln't see any error message and get empty listing of pods (what is this "pod" anyways? don't worry, you'll learn that momentarily)

# Assignment
Uncover the secret answer and win yourself some glory! The setup is simple - there's a frontend container that connects to backend container to recover the answer and present it tou you :) Let's talk specifics:

* the backend container image is ``schmeedy/secret-backend:latest``, it exposes a HTTP resource on container port ``4422`` and a super-secret path - this resource uses super-secret complex state-of-the-art logic to compute a secret value
* the frontend container image is ``schmeedy/secret-frontend:latest``
    * it knows the secret path and tries to connect to the backend using URL passed to it via environment variable ``BACKEND``
    * you havent's seen how environment variables for a pod can be defined - the following snippet should help you:
```
{
    "name": "secret-frontend",
    "image": "schmeedy/secret-frontend:latest",
    "env": [{
        "name": "BACKEND",
        "value": "who-knows"
    }]
    ...
```
* ideally, containers (pods) can be wired together via a service (remember you can access services in pods through their DNS name: ``${service}.${namespace}.kubernetes.local``)
* it's also a good idea to run pods (even with one replica) under supervised by a replication controller if you don't want them to suddenly dissapear (f.ex. in the event of node failure)
* 