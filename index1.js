import fs from 'fs';

fs.rename("text.txt", "hello.txt", err => {
    if (err) throw err;
    console.log("The file has been renamed!");
});