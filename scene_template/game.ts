
const model = new Entity()
model.addComponent(new GLTFShape('Road_0.glb'))
const transform = new Transform({ position: new Vector3(8, 0, 8) })
transform.rotate(Vector3.Up(), 90)
model.addComponent(transform)
engine.addEntity(model)
