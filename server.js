const express = require('express');
const app = express();
//BodyParser
const bodyparser = require('body-parser');

//Mongo DB
const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var db,
    collection;

//Conectando com o Mongo Db   
MongoClient.connect("mongodb://localhost:27017",{ useNewUrlParser: true }, (err, client) => {  
    if(err) return console.log(err);
    db = client.db('diegodb');  
    collection = db.collection('data');
    app.listen(3000, () => {        
        console.log('Rodando o express na porta 3000')
    })
})

//Adicionando BodyParser para leitura dos dados
app.use(bodyparser.urlencoded({
    extended: true
}))

//Adicionando Tipo de JSON para o Mongo
app.use(bodyparser.json());

//Adicionando CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept')
    next()
});

//Get inicial do arquivo
app.get('/', function(req, res){
    res.send('Bem-vindo a API CRUD')
})

//Listagem dos dados presentes do banco de dados
app.get('/lista', (req,res) => {
    collection.find({}).toArray(function(err, docs) {
        res.send(docs);
    });
})

//Criando Rotas
app.route('/edit/:id')
    .get((req,res) => {
        //Pesquisar específico
        collection.find({"_id" : ObjectId(req.params.id)}).toArray(function(err, docs) {
            res.send(docs)
        });
    })
    .put((req,res) => {
        //Alterar
        collection.updateOne({ _id : ObjectId(req.params.id) },
        { $set: { name : req.body.name,
                    surname: req.body.surname        
        } }, function(err, result) {
            res.send(`Usuário ${req.body.name} editado com sucesso!`)
        });
    })
    .delete((req,res) => {
        //Deletar
        collection.deleteOne({"_id" : ObjectId(req.params.id)},function(err, resp){
            res.send(`Usuário ${req.params.id} apagado com sucesso!`)
        })
    })

app.post('/show',function(req, res){
    db.collection('data').insertOne(req.body, (err, result) => {
        //Gravar
        if(err) return console.log(err);
        res.send(`Usuário ${req.body.name} salvo com sucesso!`)
    })
})