let prevMinute = -1;


function setup() {
    createCanvas(800, 800);
    angleMode(DEGREES);
}


function draw() {
    background(15, 15, 25);
    translate(width / 2, height / 2);
    
    // Get current time using p5.js functions
    let h = hour();
    let m = minute();
    let s = second();
    
    // Print minute to console every time it changes (not more frequently)
    if (m !== prevMinute) {
        console.log(m);
        prevMinute = m;
    }
    

    let secondProportion = s / 60;
    let minuteProportion = m / 60;
    let hourProportion = (h % 12) / 12;
    
    // Calculate angles (0-360 degrees)
    let secondAngle = map(s, 0, 60, 0, 360);
    let minuteAngle = map(m, 0, 60, 0, 360);
    let hourAngle = map(h % 12, 0, 12, 0, 360);
    

    let ms = millis() % 1000;
    let smoothSecondAngle = secondAngle + map(ms, 0, 1000, 0, 6);
    
    // Draw the three layers of time
    drawSeconds(smoothSecondAngle, secondProportion, s);
    drawMinutes(minuteAngle, minuteProportion, m);
    drawHours(hourAngle, hourProportion, h % 12);
    
    // Center indicator
    fill(255);
    noStroke();
    circle(0, 0, 12);
}


function drawSeconds(angle, proportion, s) {
    let radius = 330;
    let numDots = 60;
    
    // Draw all 60 second positions
    for (let i = 0; i < numDots; i++) {
        let dotAngle = map(i, 0, numDots, 0, 360) - 90;
        let x = cos(dotAngle) * radius;
        let y = sin(dotAngle) * radius;
        
        noStroke();
        
        if (i === s) {
            // Current second - bright and large
            fill(100, 200, 255);
            circle(x, y, 16);
        } else if (i < s) {
            // Past seconds - medium brightness
            fill(60, 120, 180, 200);
            circle(x, y, 8);
        } else {
            // Future seconds - dim
            fill(40, 60, 80, 120);
            circle(x, y, 5);
        }
    }
    

    noFill();
    stroke(60, 80, 100, 100);
    strokeWeight(1);
    circle(0, 0, radius * 2);
}


function drawMinutes(angle, proportion, m) {
    let radius = 230;
    
    // Background circle
    noFill();
    stroke(50, 50, 70, 80);
    strokeWeight(2);
    circle(0, 0, radius * 2);
    
    // Growing arc showing elapsed minutes
    strokeWeight(30);
    noFill();
    

    let r = map(proportion, 0, 1, 120, 200);
    let g = map(proportion, 0, 1, 80, 140);
    let b = 255;
    stroke(r, g, b, 220);
    

    if (angle > 0) {
        arc(0, 0, radius * 2, radius * 2, -90, angle - 90);
    }
    

    fill(r + 40, g + 40, b);
    noStroke();
    let markerX = cos(angle - 90) * radius;
    let markerY = sin(angle - 90) * radius;
    circle(markerX, markerY, 24);
    
    // Minute tick marks (every 5 minutes)
    stroke(100, 100, 120, 150);
    strokeWeight(2);
    for (let i = 0; i < 60; i += 5) {
        let tickAngle = map(i, 0, 60, 0, 360) - 90;
        let x1 = cos(tickAngle) * (radius - 25);
        let y1 = sin(tickAngle) * (radius - 25);
        let x2 = cos(tickAngle) * (radius + 25);
        let y2 = sin(tickAngle) * (radius + 25);
        line(x1, y1, x2, y2);
    }
}

// HOURS - Inner rotating polygon
function drawHours(angle, proportion, h) {
    let sides = 12;
    let radius = 130;
    
    // Draw 12-sided polygon background
    fill(30, 30, 50, 150);
    stroke(80, 80, 110, 180);
    strokeWeight(2);
    
    beginShape();
    for (let i = 0; i < sides; i++) {
        let vertexAngle = map(i, 0, sides, 0, 360) - 90;
        let x = cos(vertexAngle) * radius;
        let y = sin(vertexAngle) * radius;
        vertex(x, y);
    }
    endShape(CLOSE);
    
    // Highlight current hour segment
    let segmentAngle = 360 / sides;
    fill(255, 180, 80, 200);
    noStroke();
    
    beginShape();
    vertex(0, 0);
    let startAngle = h * segmentAngle - 90;
    let endAngle = (h + 1) * segmentAngle - 90;
    
    for (let a = startAngle; a <= endAngle; a += 1) {
        let x = cos(a) * radius;
        let y = sin(a) * radius;
        vertex(x, y);
    }
    endShape(CLOSE);
    
    // Draw hour markers with numbers
    for (let i = 0; i < 12; i++) {
        let markerAngle = map(i, 0, 12, 0, 360) - 90;
        let x = cos(markerAngle) * (radius + 30);
        let y = sin(markerAngle) * (radius + 30);
        
        // Dot marker
        noStroke();
        if (i === h) {
            fill(255, 200, 100);
            circle(x, y, 16);
        } else {
            fill(120, 120, 140, 180);
            circle(x, y, 10);
        }
        
        // Hour number
        fill(220, 220, 240);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(14);
        let displayHour = i === 0 ? 12 : i;
        text(displayHour, x, y);
    }
}