
const model = new Entity()
model.addComponent(new GLTFShape('models/Road_C.gltf'))
const transform = new Transform({ position: new Vector3(0, 0, 0) })
transform.rotate(Vector3.Up(), 90)
model.addComponent(transform)
engine.addEntity(model)
