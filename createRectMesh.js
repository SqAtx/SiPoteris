#pragma strict


/*
	Creation : 04/06/2013
	Author : Fabien Daoulas
	Last update
	
	This script creates plane over an other plane, that can be tactile areas on the screen of iPad.
	A plane is defined with three parameters:
				-center of the plane
				-height in percentage of the height of the video
				-width in percentage of the width of the video
				
	number of lines : 300
*/

private var surface : GameObject;

// scripts
private var show : showingWindow;
private var video : videoSettings;


// radius of sphere where th rectangle will be splited
private var radius : float = 4;


///////////////////
//////2D view//////
///////////////////

/*
 * get plane where the movie is displayed
*/
function SetSurface( s : GameObject ) {
	surface = s ;
}

/*
	*create rectangle in 2D view
*/
public function createRect2D( t : Hashtable , path : String ){
	if(	t.ContainsKey( 'posx' ) 		&&
		t.ContainsKey( 'posy' ) 		&&
		t.ContainsKey( 'sizex' )		&&
		t.ContainsKey( 'sizey' ) 		&&
		t.ContainsKey( 'name' )  		&&
		surface){// check if all elements needed to create the plane are not null
		
		show = gameObject.GetComponent("showingWindow") as showingWindow;
		
		// set the position of plane
		if( typeof(t['posx']) == typeof(String) )//check type of elements
			var posX = float.Parse( t['posx'] );
		else
			posX = t['posx'];
		if( typeof(t['posy']) == typeof(String) )//check type of elements
			var posY = float.Parse( t['posy'] );
		else
			posY = t['posy'];
		if( typeof(t['sizex']) == typeof(String) )//check type of elements
			var sizeX : float = float.Parse( t['sizex'] );
		else
			sizeX = t['sizex'];
		if( typeof(t['sizey']) == typeof(String) )//check type of elements
			var sizeY : float = float.Parse( t['sizey'] );
		else
			sizeY = t['sizey'];

		// create a new plane
		var obj : GameObject = GameObject.CreatePrimitive( PrimitiveType.Plane );
		obj.name = "2D_rect_"+t['name'];
		
		if( path ){
			// load asset
			try {
				// load asset
				var texture : Texture2D = Resources.Load( path,Texture2D ) as Texture2D;
			} catch( e) {
				texture = null;
			}
			// texture invalide
			if(! texture) {
				Console.Warning("No file found at path : " + path);
			}
			
			// add texture to display on the plane
			obj.renderer.material.mainTexture = texture;
			obj.renderer.enabled = true;
			// get ratio of texture
			var ratio : float = texture.width*1.0/texture.height;
			// calculate optimal size
			var opSize : Vector2 = optimalSize( sizeX , sizeY , ratio );
			
			// set position of plane
			setRect2D( posX , posY , opSize.x , opSize.y, obj );
			
			return obj;
		
		}//if
		else{
			// disable/enable renderer
			obj.renderer.enabled = true;
			// set position of plane
			setRect2D( posX , posY , sizeX , sizeY , obj );
			return obj;
		}
	}
	else{
		Console.Warning("An element is missing in xml_data to create the plane or the gameobject on which the movie is displayed is not assigned");
		return null;
	}
}

/*
	*positionnate the plane according to the information loaded in the xml
	*video plane is perpendicular to the y-axis
*/
private function setRect2D( posX : float , posY : float , sizex : float , sizey : float , g : GameObject ){
	// get mesh of the video plane
	var meshFilterVideo : MeshFilter;
	meshFilterVideo = surface.GetComponent("MeshFilter");
	var meshVideo : Mesh = meshFilterVideo.mesh;
	
	// set the rotation of plane
	g.transform.rotation = surface.transform.rotation;
	g.transform.Rotate(0,180,0);
	
	g.transform.position.x = posX*meshVideo.bounds.size.x - meshVideo.bounds.size.x/2 + surface.transform.position.x;
	g.transform.position.y = surface.transform.position.y - 0.1;
	g.transform.position.z = posY*meshVideo.bounds.size.z - meshVideo.bounds.size.z/2 + surface.transform.position.z;
	
	
	// set scale of plane
	// get scale of videoplane
	var v : Vector3 = surface.transform.localScale;
	var vPlane : Vector3;
	
	vPlane.x = v.x*sizex;
	vPlane.y = v.y;
	vPlane.z = v.z*sizey;
	g.transform.localScale = vPlane;
}

/*
	*calculate optimal size of height and width to fit the area 
*/
private function optimalSize( sizex : float , sizey : float , ratio : float ) : Vector2 {
	var ratioMax : float = sizex/sizey;
	var width : float;
	var height : float;
	var SIZE : Vector2 ;
	// resize plane to fit ratio
	if( ratio >= 1 ){
		height = sizex/ratio;
		width = sizex;
		if( height > sizey ){
			height = sizey;
			width = height*ratio;
		}
	}
	if( ratio < 1 ){
		width = sizey*ratio;
		height = sizey;
		if( width > sizex ){
			width = sizex;
			height = width/ratio;
		}
	}
	
	SIZE.x = width;
	SIZE.y = height;
	
	return SIZE;
}


/*
 * give a point in the normal axe of the plane which is passing by the center
 */
public function getOrientedTo( t : Hashtable , obj : GameObject) : Vector3 {
	
	var v : Vector3 = obj.transform.position;
	return v + Vector3( 0,1,0);
}

///////////////////
//////3D view//////
///////////////////




function createRect3DParam(theta : float , phi : float , scale : float , ratiotexture : float , name : String, path : String ) : GameObject {
	
	// set position, scale, rotation of rectangle
	var obj : GameObject = setRect3D( theta , phi , scale , ratiotexture , name );
	if( path ){
		
		try {
			// load asset
			var texture : Texture2D = Resources.Load( path,Texture2D ) as Texture2D;
		} catch( e) {
			texture = null;
		}
		// texture invalide
		if(! texture) {
			Console.Warning("No file found at path : " + path);
		}
		
		// add texture to display on the plane
		obj.renderer.material = Resources.Load('GUI/window/mat');
		obj.renderer.material.mainTexture = texture;
		obj.renderer.enabled = true;
		
		// get ratio of texture
		var ratio : float = 1.0*texture.width/texture.height;
		// apply this ratio to the rectangle
		obj.transform.localScale = Vector3( scale*Mathf.Sqrt(ratio) , 0 , scale/Mathf.Sqrt(ratio) );
		
		return obj;
			
	}//if
	else{
		// disable/enable renderer
		obj.renderer.enabled = true;
		return obj;
	}
}



/*
	*create rectangle in 3D view
*/
function createRect3D( t : Hashtable , path : String ) : GameObject {

	video = gameObject.GetComponent("videoSettings") as videoSettings;
	
	if(	t.ContainsKey( 'longitude' ) 	&&
		t.ContainsKey( 'latitude' ) 	&&
		t.ContainsKey( 'scale' ) 		&&
		t.ContainsKey( 'name' )			&&
		t.ContainsKey( 'ratiotexture')	) {
		
			if( typeof(t['longitude']) == typeof(String) )// check type of elements in hashtable
				var theta : float = float.Parse( t['longitude'] ) * Mathf.PI/180;// convert to radian
			else{
				theta = t['longitude'];
				theta = theta * Mathf.PI/180;// convert to radian
			}
			if( typeof(t['latitude']) == typeof(String) )// check type of elements in hashtable
				var phi : float = float.Parse( t['latitude'] ) * Mathf.PI/180;// convert to radian
			else{
				phi = t['latitude'];
				phi*= Mathf.PI/180;// convert to radian
			}
			if( typeof(t['scale']) == typeof(String) )// check type of elements in hashtable
				var scale : float = float.Parse( t['scale'] );
			else
				scale = t['scale'];
			if( typeof(t['ratiotexture']) == typeof(String) )//check type of elements in hashtable
				var ratiotexture : float = float.Parse( t['ratiotexture'] );
			else			
				ratiotexture = t['ratiotexture'];
			
			var name : String = t['name'];
			return createRect3DParam(theta, phi, scale, ratiotexture, name, path);
	
	} else{// return null if a parameter is missing in the xml file - the gameobject is not created
		Console.Warning("An element is missing in xml_data to create the mesh");
		return null ;
		
		}
}

/*
	*set rectangle 3D
*/
private function setRect3D( theta : float , phi : float , scale : float , ratiotexture : float , name : String ) : GameObject{
				
	// create new plane
	var obj : GameObject = GameObject.CreatePrimitive( PrimitiveType.Plane );
	obj.name = "3D_rect_"+name;
			
	// set position of plane around the sphere
	var v : Vector3;
	v.x = radius * Mathf.Sin(theta) * Mathf.Cos(phi)  	+ ( video.getSpherePos() ).x ;
	v.y = radius * Mathf.Sin(phi) 						+ ( video.getSpherePos() ).y;
	v.z = radius * Mathf.Cos(theta) * Mathf.Cos(phi)  	+ ( video.getSpherePos() ).z;
	obj.transform.position = v;
		
	// set rotation of plane to face the center of the sphere
	obj.transform.LookAt( video.getSpherePos() );
	obj.transform.localEulerAngles += Vector3(90,0,0);
		
	// set scale
	if( ratiotexture > 0)
		obj.transform.localScale = Vector3( scale*Mathf.Sqrt(ratiotexture) , 0 , scale*1.0/Mathf.Sqrt(ratiotexture) );
	else
		obj.transform.localScale = Vector3( scale , 0 , scale );		
					
	// disable/enable renderer
	obj.renderer.enabled = false;
			
	return obj;
}
