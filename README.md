# COMP4350 Assignment 1

> Arvind Maan

Assignment 1 for the COMP 4350 Software Engineering class.

This project displays information gathered from the [Stackoverflow API](https://api.stackexchange.com/docs)

# Running the Project

## Docker Hub

Pull the latest docker container

```
docker pull arvindmaan/comp4350a1:latest
```

Then run the docker container

```
docker run -p 3000:3000 arvindmaan/comp4350a1:latest
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser, by default.

If you changed the port this will be different.

## Locally Running

In the project directory, you can run:

```
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
