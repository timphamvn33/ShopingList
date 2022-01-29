exports.getDate = function getDate(){ // simplify the function 
    var options={
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    }
    let today = new Date().toLocaleDateString("en-US", options)
    return today
}
exports.getDay= function getDay(){
    var options={
        weekday: 'long',
        
    }
    let today = new Date().toLocaleDateString("en-US", options)
    return today
}