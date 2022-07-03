const mysql=require('mysql');

const pool=mysql.createPool({
    connectionLimit:100,
    host           :process.env.DB_HOST,
    user           :process.env.DB_USER,
    password       :process.env.DB_PASS,
    database       :process.env.DB_NAME
})

//view users
exports.view=(req,res)=>{



    
    //Connecto to db
    pool.getConnection((err,connection)=>{
        if(err)throw err;
        console.log('Connected as id'+connection.threadId)
      //User the connection
      connection.query('SELECT * FROM user WHERE status="active"',(err,rows)=>{
        //When done with the connection
        connection.release();
        if(!err){
          let removedUser=req.query.removed;
            res.render('home',{rows,removedUser})
        }
        else{
            console.log(err)
        }
        console.log('The data from the user table : \n ',rows)



      })
    })
    
}
 //find user by search 
exports.find=(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err)throw err;
        console.log('Connected as id'+connection.threadId)
        let searchTerm=req.body.search;

      //User the connection
      connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?',['%'+searchTerm+ '%','%'+searchTerm+ '%'],(err,rows)=>{
        //When done with the connection
        connection.release();
        if(!err){
            res.render('home',{rows})
        }
        else{
            console.log(err)
        }
        console.log('The data from the user table : \n ',rows)



      })
    })
   
}



//Add new user
exports.form=(req,res)=>{
  res.render('signup.hbs')
}
exports.create = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;
  
pool.getConnection((err,connection)=>{
  if(err) throw err;
  console.log('Connected as ID'+ connection.threadId);
let searchTerm = req.body.search;
  // User the connection
  connection.query('INSERT INTO inventory_management.user SET first_name = ?,last_name = ?,email = ?,phone = ?,comments = ?', [first_name, last_name,
     email, phone, comments], (err, rows) => {
    connection.release();
    if (!err) {
      res.render('signup.hbs',{alert:'User added successfully'});
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
});
};

//edit record
exports.edit=(req,res)=>{
  pool.getConnection((err,connection)=>{
    if(err)throw err;
    console.log('Connected as id'+connection.threadId)
  //User the connection
  connection.query('SELECT * FROM user WHERE id=?',[req.params.id],(err,rows)=>{
    //When done with the connection
    connection.release();
    if(!err){
        res.render('edituser',{rows})
    }
    else{
        console.log(err)
    }
    console.log('The data from the user table : \n ',rows)



  })
})

}
//update user 
exports.update=(req,res)=>{
  const { first_name, last_name, email, phone, comments } = req.body;

  pool.getConnection((err,connection)=>{
    if(err)throw err;
    console.log('Connected as id'+connection.threadId)
  //User the connection
  connection.query('UPDATE user SET first_name =? ,last_name=?, email=?,phone=?,comments=? WHERE id=?',[first_name,last_name,email,phone,comments,req.params.id],(err,rows)=>{
    //When done with the connection
    connection.release();
    if(!err){
      pool.getConnection((err,connection)=>{
        if(err)throw err;
        console.log('Connected as id'+connection.threadId)
      //User the connection
      connection.query('SELECT * FROM user WHERE id=?',[req.params.id],(err,rows)=>{
        //When done with the connection
        connection.release();
        if(!err){
            res.render('edituser',{rows,alert:`${first_name} has been updated.`})
        }
        else{
            console.log(err)
        }
        console.log('The data from the user table : \n ',rows)
      })
    })
  }
  else{
        console.log(err)
    }
    console.log('The data from the user table : \n ',rows)



  })
})

}
//delete record
exports.delete=(req,res)=>{
//   pool.getConnection((err,connection)=>{
//     if(err)throw err;
//     console.log('Connected as id'+connection.threadId)
//   //User the connection
//   connection.query('DELETE FROM user WHERE id=?',[req.params.id],(err,rows)=>{
//     //When done with the connection
//     connection.release();
//     if(!err){
// res.redirect('/')    }
//     else{
//         console.log(err)
//     }
//     console.log('The data from the user table : \n ',rows)



//   })
// })
pool.getConnection((err,connection)=>{
  if(err)throw err;
  console.log('Connected as id'+connection.threadId)
//User the connection
connection.query('UPDATE user SET status=? WHERE id=?',['removed',req.params.id],(err,rows)=>{
  //When done with the connection
  connection.release();
  if(!err){
    let removedUser=encodeURIComponent('User successfully removed.');
res.redirect('/?removed='+removedUser)    }
  else{
      console.log(err)
  }
  console.log('The data from the user table : \n ',rows)



})
})

}
//view users
exports.viewall=(req,res)=>{    
  //Connecto to db
  pool.getConnection((err,connection)=>{
      if(err)throw err;
      console.log('Connected as id'+connection.threadId)
    //User the connection
    connection.query('SELECT * FROM user WHERE id=?',[req.params.id],(err,rows)=>{
      //When done with the connection
      connection.release();
      if(!err){
      res.render('view-user',{rows})
      }
      else{
          console.log(err)
      }
      console.log('The data from the user table : \n ',rows)



    })
  })
  
}