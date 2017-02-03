<?php
//创建对象并打开连接，最后一个参数是选择的数据库名称
$mysqli = new mysqli('localhost','root','','todolist');
//检查连接是否成功
if (mysqli_connect_errno()){
	//注意mysqli_connect_error()新特性
	die('Unable to connect!'). mysqli_connect_error();
}

if($_SERVER['REQUEST_METHOD'] == 'GET'){
  $result = $mysqli->query("select * from list");
  $arr = array();
  while($row = $result->fetch_array()){
    $obj = ["id"=>$row[0],"name"=>$row[1],"isTick"=>$row[2]];
    array_push($arr, $obj);
  }
  echo json_encode($arr);
}else if($_SERVER['REQUEST_METHOD'] == 'POST'){

}else if($_SERVER['REQUEST_METHOD'] == 'PUT'){

}else if($_SERVER['REQUEST_METHOD'] == 'DELETE'){

}
//执行sql语句，完全面向对象的

?>
