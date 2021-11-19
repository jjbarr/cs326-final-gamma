CREATE TABLE users (
       uname VARCHAR PRIMARY KEY,
       password VARCHAR
);

CREATE TABLE landmarks (
       id SERIAL PRIMARY KEY,
       lat DOUBLE PRECISION,
       long DOUBLE PRECISION,
       lname VARCHAR,
       description VARCHAR,
       creator VARCHAR,
       FOREIGN KEY(creator) REFERENCES users(uname)
);

CREATE TABLE reviews (
       id SERIAL PRIMARY KEY,
       creator VARCHAR,
       landmark INTEGER,
       stars INTEGER,
       body VARCHAR,
       FOREIGN KEY(creator) REFERENCES users(uname),
       FOREIGN KEY(landmark) REFERENCES landmarks(id)
);

CREATE INDEX coords ON landmarks (lat,long);
