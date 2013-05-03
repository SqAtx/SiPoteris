/*

	Creation : 24/04/2013
	Author : Fabien Daoulas
	Last update : 29/04/2013
	
*/

private var lastTime : float = 0 ;


/*
	*move 2D surface to fit with the movement of the movie
*/
public function moveSurface( t : GameObject ){
	
	var s : scriptForPlane = t.GetComponent( "scriptForPlane" );
	
	var n  : String = s.getName();
	var dt = Time.time-s.getLastMoveTime();
	
	t.transform.eulerAngles += Vector3( 0 , -s.getDelta()*dt , 0 );
	
	s.updateLastMoveTime();
}



/*
	*move 2D surfaces to fit with the movement of the movie
*/
public function moveSurfaces( t : GameObject[] ){
	
	var dt = Time.time-lastTime; 
	lastTime = Time.time;
	
	for( var i = 0 ; i < t.length ; i ++){
	
		var s : scriptForPlane = t[i].GetComponent( "scriptForPlane" );
		var n  : String = s.getName();

		t[i].transform.eulerAngles += Vector3( 0 , -s.getDelta()*dt , 0 );
	}
}




