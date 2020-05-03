function formatDate(date){
    let d = date.toISOString().split('T')[0];
    let d2 = d.split('-');
    let day = d2[2];
    let month = d2[1];
    let year = d2[0];
    return `${day}.${month}.${year}`;
}

function reformatDate(date){
    let d = date.split('.');
    let day = d[0];
    let month = d[1];
    let year = d[2];
    return `${year}-${month}-${day}`;
}

module.exports = {
    formatDate,
    reformatDate
}