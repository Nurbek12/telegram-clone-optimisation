export const generateUserColor = () => {
    const colors = ['#ff6347', '#6495ed', '#dc143c', '#ff8c00', '#00ced1', '#ffd700', '#ff1493','#9932cc','#00ff00']
    const randcolor = Math.floor(Math.random()*colors.length);
    return colors[randcolor];
}

export const generateCode = () => {
    let code = '';
    for (let i = 0; i < 5; i++) {
        code += Math.floor(Math.random() * 10).toString();
    }
    return code;
}