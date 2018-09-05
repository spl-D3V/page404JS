function createBufferMSG(msg, w, h, font, fsize){
    let b = createGraphics(w, h);
    b.textFont(font);
    b.textSize(fsize);
    b.fill(255);
    b.text(msg, 0, h);
    return b;
}