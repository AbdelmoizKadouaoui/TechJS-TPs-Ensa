
function setIntervalCopie (time) {
    for (let i = 0; i < Infinity; i++){
        setTimeout(() => {
            print("hello : " + i)
        }, time);
    }
}
