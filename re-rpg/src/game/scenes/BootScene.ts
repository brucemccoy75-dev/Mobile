import Phaser from 'phaser';

// Milestone 0: nothing to load yet. Later: atlas, fonts, audio, then hand off.
export class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  create() {
    this.scene.start('Title');
  }
}
