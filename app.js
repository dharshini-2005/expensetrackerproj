// const express = require("express");
// const app = express();

// const port = 3000;
// const data = [
//     {id:1,name:'jana',address:"aa"},
//     {id:2,name:'dharsh',address:"bb"},
//     {id:3,name:'adri',address:"cc"},
// ];


// app.listen(port,()=>{
//     console.log(server is running on http://localhost:${port});
// });

// // app.get('/api/details', (req,res)=>{
// //     const {id} = req.query;
// //     if(id){
// //         const result = data.find((item)=>item.id ===Number(id));
// //         if(result){
// //             res.json(result);
// //         }
// //         else{
// //             res.status(400).json({error:"data not found"});
// //         }
// //     }
// //         else{
// //             res.json(data);
// //         }
// //     })

// app.get('/student/singledetail',(req,res)=>{
//     const {name,id}=req.query;
//     if(name,id){
//         const result=data.find((item) => item.name===name && item.id===Number(id));
//         if(result){
//             res.json(result);
//         }
//         else{
//             res.status(400)({error:"Data not found"})
//         }
      
//     }
//     else{
//         res.json(data);
//     }
//     })
    

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const mongourl = "mongodb://localhost:27017/Expensee"
mongoose.connect(mongourl)
.then(()=>{
    console.log("Database Connected Successfully")
    app.listen(port,()=>{
        console.log(`Server is running at port ${port}`)
    })
})
.catch((err)=>{
    console.log(err);
})

const expenseSchema = new mongoose.Schema({
    id:{type: String, required: true, unique: true},
    title:{type: String, required: true},
    amount:{type: Number, required: true}
});

const expenseModel = mongoose.model("Expensee",expenseSchema);

app.get("/api/expenses", async (req,res)=>{
    try{
        const expenses = await expenseModel.find();
        res.status(200).json(expenses);
    }
    catch(error){
        res.status(500).json({message:"Failed to fetch expenses"});
    }
});

app.get("/api/expenses/:id", async (req,res)=>{
    try{
        const {id} = req.params;
        const expenses = await expenseModel.findOne({id});
        res.status(200).json(expenses);
    if(!expenses){
        return res.status(400).json({message:"Expense not found"})
    }
    res.status(200).json(expenses);
}
    catch(error){
        res.status(500).json({message:"Failed to fetch expenses"});
    }
});


app.use(express.json());
const{v4: uuidv4} = require("uuid");
app.post("/api/expenses",async (req,res)=>{
    let body = "";
    const {title,amount} = req.body;
    req.on("end", async ()=>{
        const data = JSON.parse(body);
        const newExpense = new expenseModel({
            id:uuidv4(),
            title: data.title,
            amount: data.amount,
        });
        const savedExpense = await newExpense.save();
        res.status(200).json(savedExpense);
    });
});

app.use(express.json());
app.put("/api/expenses/:id", async (req,res)=>{
    const {id} = req.params;
    const {title,amount} = req.body;
    console.log({title})
    try{
        const updateExpense = await expenseModel.findOneAndUpdate(
            {id},
            {title,amount}
        );
        if(!updateExpense){
            return res.status(400).json({message:"Expense not found"});
        }
        res.status(200).json({title,amount});
    }
    catch(error){
        res.status(500).json({message:"Error in updating expense"});
    }
});

app.use(express.json());
app.put("/api/expenses/:id", async (req,res)=>{
    const {id} = req.params;
    const {title,amount} = req.body;
    console.log({title})
    try{
        const updateExpense = await expenseModel.findOneAndUpdate(
            {id},
            {title,amount}
        );
        if(!updateExpense){
            return res.status(400).json({message:"Expense not found"});
        }
        res.status(200).json({title,amount});
    }
    catch(error){
        res.status(500).json({message:"Error in updating expense"});
    }
});