//const express = require('express');
import express from 'express';
const app = express();
const port = 8180;
app.use(express.static('client'));

app.get('/login', (req, res) => {
    res.redirect('login.html');
});
app.post('/login', (req, res) => {});
app.post('/logout', (req, res) => {});
app.post('/signup', (req, res) => {});
app.get('/signup', (req, res) => {
    res.redirect('Signup.html');
});
app.post('/create_landmark', (req, res) => {});
app.get('/landmark/:id', (req, res) => {});
app.patch('/landmark/:id', (req,res) => {});
app.delete('/landmark/:id', (req,res) => {});
app.post('/landmark/:id/add_review', (req,res) => {});
app.get('/review/:id', (req,res) => {});
app.patch('/review/:id', (req, res) => {});
app.delete('/review/:id', (req,res) => {});
app.get('/user/:id', (req,res) => {});
app.get('/landmarks_in', (req, res) => {});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
