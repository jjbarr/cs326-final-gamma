This version of Landmarkster is backed by Postgres. The steps to install and
configure a postgres daemon are not listed here, as it varies by your
configuration and setup.

However you configure postgres, you should use `psql [database] -f schema.sql`
in the project's root directory to correctly setup the database (where database
is the name of your database). If the database was previously used, for example
by a previous version of the application with an incompatible schema, you will
need to drop the existing tables.

If you wish to configure the port that the application will run on to something
other than the default of 3000, you will need to set the `PORT` environment
variable to the port that you choose. You should also set the `SECRET`
environment variable to a string of your choosing that is (as is implied by the
name) secret. If you do not do this, the string 'SECRET' will be used (for
testing purposes). As this is obviously insecure, we recommend you take the step
of actually picking something else.

In order to tell the application where your configured database is, you will
need to use the `DATABASE_URL` environment variable. This is a standard Postgres
URL of the format `postgresql://user:password@host:port/database?parameters`,
with almost every element of the URL being, technically speaking, optional. The
correct URL will depend on your database setup, and is thus known only to you:
we thus unfortunately cannot document it here.

After setting your environment variables, you may simply run `node server.js`,
or, equivalently, `npm run start`. The application should now be running and
accessible from your browser.
