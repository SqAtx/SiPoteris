/*
	Creation : 04/06/2013
	Author : Fabien Daoulas
	Last update
	
	This script creates plane over an other plane, that can be tactile areas on the screen of iPad.
	A plane is defined with three parameters:
				-center of the plane
				-height in percentage of the height of the video
				-width in percentage of the width of the video
*/

private var surface : GameObject;

// scripts
private var show : showingWindow;

/*
 * get plane where the movie is displayed
*/
function SetSurface( s : GameObject ) {
	surface = s ;
}

/*
	*create rectangle
*/
public function createRect( t : Hashtable ){
	if(	t.ContainsKey( 'posx' ) &&
		t.ContainsKey( 'posy' ) &&
		t.ContainsKey( 'sizex' ) &&
		t.ContainsKey( 'sizey' ) &&
		t.ContainsKey( 'name' ) 	 &&
		surface){// check if all elements needed to create the plane are not null
		
		show = gameObject.GetComponent("showingWindow") as showingWindow;

		// create a new plane
		var obj : GameObject = GameObject.CreatePrimitive( PrimitiveType.Plane );
		obj.name = "2D_rect_"+t['name'];
		
		// set position of plane
		setPlane( t , obj );
	
		// disable renderer
		obj.renderer.enabled = true;
	
		return obj;
	}
	else{
		Console.Warning("An element is missing in xml_data to create the plane or the gameobject on which the movie is displayed is not assigned");
		return;
	}
}

/*
	*positionnate the plane according to the information loaded in the xml
	*video plane is perpendicular to the y-axis
*/
private function setPlane( t : Hashtable , g : GameObject ){
	// set the rotation and position of plane
	// now the plane is at the center of the video plane and has the same rotation
	g.transform.position = surface.transform.position;
	g.transform.rotation = surface.transform.rotation;

	// get mesh of the video plane
	var meshFilterVideo : MeshFilter;
	meshFilterVideo = surface.GetComponent("MeshFilter");
	var meshVideo : Mesh = meshFilterVideo.mesh;
	
	// set the position of plane
	var posX = float.Parse( t['posx'] );
	var posY = float.Parse( t['posy'] );
	
	g.transform.position.x -= posX*meshVideo.bounds.size.x/2;
	g.transform.position.z += posY*meshVideo.bounds.size.z/2;
	
	// set scale of plane
	// get scale of videoplane
	var v : Vector3 = surface.transform.localScale;
	var vPlane : Vector3;
	vPlane.x = v.x*float.Parse( t['sizex'] );
	vPlane.y = v.y;
	vPlane.z = v.z*float.Parse( t['sizey'] );
	g.transform.localScale = vPlane;
}

/*
 * give a point in the normal axe of the plane which is passing by the center
 */
public function getOrientedTo( t : Hashtable , obj : GameObject) : Vector3 {
	
	var v : Vector3 = obj.transform.position;
	return v + Vector3( 0,1,0);
}
