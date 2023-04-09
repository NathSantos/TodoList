const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const lodash = require("lodash");

const app = express();
const port = 3000;

// Using 'ejs' as 'view engine'.
// view engine vai procurar por padrão os documentos em uma pasta "views", 
// portanto precisamos criar essa pasta no nosso diretório.
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));




// Connecting to mongoDB
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", {useNewUrlParser:true});

// Creating a Schema
const itemsSchema = {
    name: String
};

// Creating a collection using a Schema
const Item = mongoose.model('Item', itemsSchema);

// Creating documents that'll be part of our Collection
const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "Add some itens to your list!"
});

const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);




app.get('/', function(req, res) {

    Item.find().then((foundItens) => {

        if(foundItens.length === 0) {
            Item.insertMany(defaultItems)
            .then(() => console.log("Succesfully saved default items to DB!!"))
            .catch((err) => console.log(err));
            res.redirect("/");
        } else {
            /* render do arquivo "list.ejs" dentro da pasta views e substituindo a chave
            'listTitle' definida lá por foundItens, que são os itens salvos do BD */
            res.render('list', {listTitle: "Today", listItens: foundItens});
        }
    });
});

app.post('/', function(req, res) {

    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if(listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}).then(foundList => {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }
});

app.post('/delete', function(req, res) {

    const checkedItemID = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today") {
        Item.findByIdAndRemove(checkedItemID)
        .then(() => console.log("Succsesfully deleted checked item."))
        .catch((err) => console.log(err));

        res.redirect('/');
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemID}}})
        .then(foundList => {
            res.redirect("/" + listName);
        });
    }
});

app.get("/:customListName", function(req, res) {
    const customListName = lodash.capitalize(req.params.customListName);

    List.findOne({name: customListName})
    .then(foundList => {
        if(foundList) {
            // Show an existing List
            res.render("list", {listTitle: foundList.name, listItens: foundList.items})
        } else {
            // Create a new List
            const list = new List({
                name: customListName,
                items: defaultItems
            });
        
            list.save();
            res.redirect('/' + customListName);
        }
    })
    .catch(err => console.log(err)); 
});

app.listen(port, function() {
    console.log("Server rodando na porta " + port);
});