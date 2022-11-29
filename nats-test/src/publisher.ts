import nats from 'node-nats-streaming'

console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: "http://localhost:4222";
})

stan.on("connect", ()=> {
  console.log('publisher connected to NATS');
  
  const data = JSON.stringify({
    id: "123",
    tittle: "concert",
    price: 20
  })

  stan.publish("ticket:created", data, () =>{
    console.log("event published");
  })
})