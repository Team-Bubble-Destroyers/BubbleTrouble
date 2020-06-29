import Player from '../objects/Player'
import FpsText from '../objects/fpsText'
import Cable from '../objects/Cable'
import Spikes from '../objects/Spikes'
import Ball from '../objects/ball'
import Ground from '../objects/ground'
export default class FgScene extends Phaser.Scene {
  fpsText
  constructor() {
    super('FgScene')
  }

  create() {
    this.fpsText = new FpsText(this)
    this.player = new Player(this, 640, 400, 'player').setScale(4.3)
    
    this.player.setSize(18, 27, true);
    this.cursors = this.input.keyboard.createCursorKeys()

    this.cable;

    this.ground = new Ground(this, this.cameras.main.width / 2, 680, 'ground')
    this.ground.displayWidth = this.cameras.main.width

    this.ballGroup = this.physics.add.group({
      classType: Ball,
      runChildUpdate: true,
      allowGravity: true,
      // collideWorldBounds: true,
      // bounceX: 1,
      bounceY: 1,
    })

    // new Cable(this, this.player.x, this.player.y, 'cable', this.player.facingLeft)

    this.physics.add.collider(this.ground, this.ballGroup)

    this.initBall = new Ball(this, this.cameras.main.width / 2, 300, false, false, 1)
      .setScale(0.5)
      .on('pointerdown', () => {
        this.splitBall(this.initBall)
      })
    // change setCircle parameters to be half the width of the circle png img when changed. (the value is the diam of the circle)
    this.ballGroup.add(this.initBall)

    this.createCollisions()
    this.createAnimations()
    this.createGroups()
  }

  update(time, delta) {
    this.fpsText.update()

    this.player.update(this.cursors)
 
    if (this.cursors.space.isDown) {
      this.throwCable()
    }

    if(this.cable) {
      this.cable.update(null, delta);
    }
  }

  createCeiling(x, y) {
    this.spikeGroup.create(x, y, 'spikes').setScale(2).setSize(922, 15)
  }

  createGroups() {
    this.spikeGroup = this.physics.add.staticGroup({ classType: Spikes, allowGravity: false })
    this.createCeiling(0, 0)
    this.createCeiling(1844, 0)
    // this.cables = this.physics.add.group({
    //   classType: Cable,
    //   maxSize: 1,
    //   runChildUpdate: true,
    //   allowGravity: false,
    // })
  }
  createGround(x, y) {
    this.groundGroup.create(x, y, 'ground')
  }

  createAnimations() {
    this.anims.create({
      key: 'throw',
      frames: this.anims.generateFrameNumbers('player', { start: 6, end: 10 }),
      frameRate: 10,
      repeat: -1,
    })
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 5 }),
      frameRate: 8,
      repeat: -1,
    })
    this.anims.create({
      key: 'idle',
      frames: [{ key: 'player', frame: 5 }],
      frameRate: 10,
    })
  }


  splitBall(ball) {
    ball.disableBody(true, true)
    if (ball.ballSize <= 3) {
      const rightball = new Ball(this, ball.x, ball.y, false, ball, ball.ballSize + 1)
        .setCircle(ball.body.radius)
        .setScale(ball.scale * 0.75)
        .on('pointerdown', () => {
          this.splitBall(rightball)
        })
      const leftball = new Ball(this, ball.x, ball.y, true, ball, ball.ballSize + 1)
        .setCircle(ball.body.radius)
        .setScale(ball.scale * 0.75)
        .on('pointerdown', () => {
          this.splitBall(leftball)
        })

      this.ballGroup.add(rightball)
      this.ballGroup.add(leftball)
      leftball.left = true
    }
  }

  throwCable() {
    const offsetX = 2
    // let cable = this.cables.getFirstDead()

    if (!this.cable) {
      const cableX = this.player.x + (this.player.facingLeft ? -offsetX : offsetX)
      const cableY = this.player.y + 648

      this.cable = new Cable(this, cableX, cableY, 'cable', this.player.facingLeft).setScale(2)
      // this.cables.add(cable)
    }
  }

  // destroyCable() {
  //   this.cable.destroy()
  // }

  createCollisions() {
    this.physics.add.collider(this.player, this.ground)
    // this.physics.add.collider(this.cable, this.spikeGroup)
    // this.physics.add.collider(this.ballGroup, this.cable)
  }
}
// update(time, cursors, throwCable) {
//   this.updateMovement(cursors)
//   if (cursors.space.isDown && time > this.lastThrown){
//     throwCable()
//     this.lastThrown = time + this.throwDelay
//   }
// }
