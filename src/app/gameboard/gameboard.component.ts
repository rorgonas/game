import { Component, NgZone } from '@angular/core';
import { ViewChild } from '@angular/core';
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-gameboard',
  host: {'(document:keydown)': 'onKeyDown($event)'},
  templateUrl: './gameboard.component.html',
  styleUrls: ['./gameboard.component.css']
})

export class GameBoardComponent implements AfterViewInit {
  context: CanvasRenderingContext2D;
  score = 0;
  size = 4;
  width: number;
  cells = [];
  fontSize = 0;
  loss = false;
  message: string;
  @ViewChild('canvasBlock') myCanvas;

  ngAfterViewInit() {
    const canvas = this.myCanvas.nativeElement;
    this.context = canvas.getContext('2d');
    this.width = canvas.width / this.size - 6;
    this.startGame();
  }

  onClick() {
    const ctx = this.context;
    this.score = 0;
    ctx.clearRect(0, 0, 500, 500);
    this.startGame();
  }

  startGame() {
    this.createCells();
    this.drawAllCells();
    this.pasteNewCell();
    this.pasteNewCell();
  }

  finishGame() {
    this.loss = false;
    this.message = 'Sorry, you lost! Try again.';
  }

  cell(row, coll) {
    return {
      value: 0,
      x: coll * this.width + 5 * (coll + 1 ),
      y: row * this.width + 5 * (row + 1 )
    };
  }

  createCells() {
    for (let i = 0; i < this.size; i++) {
      this.cells[i] = [];
      for (let j = 0; j < this.size; j++) {
        this.cells[i][j] = this.cell(i, j);
      }
    }
  }

  drawCell(cell) {
    const ctx = this.context;
    ctx.beginPath();
    ctx.rect(cell.x, cell.y, this.width, this.width);

    switch (cell.value) {
      case 0: ctx.fillStyle = '#fffff'; break;
      case 2: ctx.fillStyle = '#eee4da'; break;
      case 4: ctx.fillStyle = '#ede0c8'; break;
      case 8: ctx.fillStyle = '#f2b179'; break;
      case 16: ctx.fillStyle = '#f59563'; break;
      case 32: ctx.fillStyle = '#f67c5f'; break;
      case 64: ctx.fillStyle = '#f65e3b'; break;
      case 128: ctx.fillStyle = '#edcf72'; break;
      case 256: ctx.fillStyle = '#edcc61'; break;
      case 512: ctx.fillStyle = '#edc850'; break;
      case 1024: ctx.fillStyle = '#edc53f'; break;
      case 2048: ctx.fillStyle = '#edc22e'; break;
      default: ctx.fillStyle = '#eee4da';
    }

    ctx.fill();
    if (cell.value) {
      this.fontSize = this.width / 2;
      ctx.font = 'bold ' + this.fontSize + 'px Arial';
      ctx.fillStyle = '#776e65';
      ctx.textAlign = 'center';
      ctx.fillText(cell.value, cell.x + this.width / 2, cell.y + this.width / 2 );
    }
  }

  drawAllCells() {
    for ( let i = 0; i < this.size; i++ ) {
      for ( let j = 0; j < this.size; j++ ) {
        this.drawCell(this.cells[i][j]);
      }
    }
  }

  pasteNewCell() {
    let countFree = 0;
    for ( let i = 0; i < this.size; i++ ) {
      for ( let j = 0; j < this.size; j++ ) {
        if (!this.cells[i][j].value) {
          countFree++;
        }
      }
    }
    console.log('Count: ', countFree);
    if (!countFree) {
      this.finishGame();
      return;
    }
    while (true) {
      const row = Math.floor(Math.random() * this.size);
      const coll = Math.floor(Math.random() * this.size);
      const cell = this.cells[row][coll];
      if (!cell.vlaue) {
        Object.assign(cell, { value:  2 * Math.ceil(Math.random() * 2) });
        this.drawAllCells();
        return;
      }
    }
  }

  onKeyDown(event) {
    if (!this.loss) {
      if (event.keyCode === 38 || event.keyCode === 87) {
        this.moveUp();
        console.log('pressed:', event);
      } else if (event.keyCode === 39 || event.keyCode === 68) {
        this.moveRight();
        console.log('pressed:', event);
      } else if (event.keyCode === 40 || event.keyCode === 83) {
        this.moveDown();
        console.log('pressed:', event);
      } else if (event.keyCode === 37 || event.keyCode === 65) {
        this.moveLeft();
        console.log('pressed:', event);
      }
    }
  }

  moveUp() {
    for ( let j = 0; j < this.size; j++ ) {
      for ( let i = 1; i < this.size; i++ ) {
        if (this.cells[i][j].value) {
          let row = i;
          while (row > 0) {
            if (!this.cells[row - 1][j].value) {
              this.cells[row - 1][j].value = this.cells[row][j].value;
              this.cells[row][j].value = 0;
              row --;
            } else if (this.cells[row - 1][j].value === this.cells[row][j].value) {
              this.cells[row - 1][j].value *= 2;
              this.score += this.cells[row - 1][j].value;
              this.cells[row][j].value = 0;
              break;
            } else {
              break;
            }
          }
        }
      }
    }
    this.pasteNewCell();
  }

  moveRight() {
    for ( let i = 0; i < this.size; i++ ) {
      for ( let j = this.size - 2; j >= 0; j-- ) {
        if (this.cells[i][j].value) {
          let coll = j;
          while (coll + 1 < this.size) {
            debugger;
            if (!this.cells[i][coll + 1].value) {
              this.cells[i][coll + 1].value = this.cells[i][coll].value;
              this.cells[i][coll].value = 0;
              coll ++;
            } else if (this.cells[i][coll].value === this.cells[i][coll + 1].value) {
              this.cells[i][coll + 1].value *= 2;
              this.score += this.cells[i][coll + 1].value;
              this.cells[i][coll].value = 0;
              break;
            } else {
              break;
            }
          }
        }
      }
    }
    this.pasteNewCell();
  }

  moveDown() {
    for ( let j = 0; j < this.size; j++ ) {
      for ( let i = this.size - 2; i >= 0; i-- ) {
        if (this.cells[i][j].value) {
          let row = i;
          while (row + 1 < this.size) {
            if (!this.cells[row + 1][j].value) {
              this.cells[row + 1][j].value = this.cells[row][j].value;
              this.cells[row][j].value = 0;
              row ++;
            } else if (this.cells[row + 1][j].value === this.cells[row][j].value) {
              this.cells[row + 1][j].value *= 2;
              this.score += this.cells[row + 1][j].value;
              this.cells[row][j].value = 0;
              break;
            } else {
              break;
            }
          }
        }
      }
    }
    this.pasteNewCell();
  }

  moveLeft() {
    for ( let i = 0; i < this.size; i++ ) {
      for ( let j = 1; j < this.size; j++ ) {
        if (this.cells[i][j].value) {
          let coll = j;
          while (coll - 1 >= 0) {
            if (!this.cells[i][coll - 1].value) {
              this.cells[i][coll - 1].value = this.cells[i][coll].value;
              this.cells[i][coll].value = 0;
              coll --;
            } else if (this.cells[i][coll].value === this.cells[i][coll - 1].value) {
              this.cells[i][coll - 1].value *= 2;
              this.score += this.cells[i][coll - 1].value;
              this.cells[i][coll].value = 0;
              break;
            } else {
              break;
            }
          }
        }
      }
    }
    this.pasteNewCell();
  }
}
