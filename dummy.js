let str="sourabh"
let rev=""
for(let i=str.length-1;i>=0;i--){
    rev+=str[i]
}

if(str==rev){
    console.log("palindrome")
}
else{
    console.log("not a palindrome")
}