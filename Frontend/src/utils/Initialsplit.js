const getInitials=(name)=>{
    return name.trim()
    .split(" ").slice(0,2)
    .map(word=>word.charAt(0).toUpperCase())
    .join("");
}

export default getInitials;