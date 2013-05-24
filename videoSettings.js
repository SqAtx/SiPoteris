#pragma strict



private var MovieController:GameObject;
private var iOS : GameObject;

//ref to the screen 2D
private var plane2D = GameObject.CreatePrimitive(PrimitiveType.Plane);
//ref to the sphere 3D
private var sphere3D:GameObject;

private var button:boolean=true;

private var Trans:Transition2D3D;

private var rotInit;


private var startRotation;
private var endRotation;
private var rate = 0.7;
private var t = 0.0;

/*
* functions.
*/

function OnPlay(){

	return button;

}


/*
*function to set the parameters of the 2D scene
*/
function videoSettings () {

	Trans = gameObject.GetComponent("Transition2D3D") as Transition2D3D;
	//instantiate
	iOS = new GameObject(); 
	iOS.name="iOS";
	iOS.AddComponent("ForwardiOSMessages");
 	var controllerIOS:ForwardiOSMessages;
	controllerIOS = iOS.GetComponent("ForwardiOSMessages");
	controllerIOS.movie = new PlayHardwareMovieClassPro[2]; 
	
	MovieController = new GameObject(); 
	MovieController.name="MovieController";
	MovieController.AddComponent("SceneController");       
	var controllerScene:SceneController;
	controllerScene = MovieController.GetComponent("SceneController");      
	controllerScene.movieClass = new PlayHardwareMovieClassPro[2];
	controllerScene.movieName = new  String[2];
	controllerScene.seekTime = new float[2];
	
	
	
	//set camera
	var rot:Quaternion=Quaternion.identity;	
	
	camera.transform.position=Vector3(0,-10,0);
	camera.transform.Rotate(Vector3(270,180,0));

	//generate the 2 scenes
	generateScene2D();
	generateScene3D();	
	     
	//set iOS forwarding
	controllerIOS.movie[0]=plane2D.GetComponent("PlayFileBasedMovieDefault");
	     
	//set the scene
	controllerScene.movieClass[0] =  plane2D.GetComponent("PlayFileBasedMovieDefault");
	controllerScene.movieClass[0].movieIndex=0;
	controllerScene.movieName[0] ="SIPO_full.mov";
		
	var parentTransform = sphere3D.transform;
	parentTransform.parent = sphere3D.transform; 	    
	parentTransform = plane2D.transform;    	    
	parentTransform.parent = sphere3D.transform;
	
	sphere3D.renderer.enabled = false;

	
	return plane2D;
}

/*
* create 2D plane
*/

function generateScene2D(){

    plane2D.transform.localScale=Vector3(1.1,1.1,1.1);
    plane2D.name="screen";
    plane2D.transform.Rotate(Vector3(180,180,0));
    plane2D.transform.position = Vector3(0,0,0);
    plane2D.AddComponent("PlayFileBasedMovieDefault");
  	plane2D.renderer.material = Resources.Load("MovieHD");

	rotInit=plane2D.transform.rotation;
	startRotation = plane2D.transform.rotation;
	endRotation = plane2D.transform.rotation * Quaternion.Euler(180,0,0);
}
/*
* create 3D sphere
*/
function generateScene3D(){

	var rot:Quaternion=Quaternion.identity;
	//load .fbx sphere on scene
	sphere3D=Instantiate(Resources.Load("SphereFULL"),Vector3(0,1.3,0),rot);
	//set it at the right position
	sphere3D.transform.Rotate(-90,0,0);
	sphere3D.transform.localScale=Vector3(500,500,500);
	sphere3D.renderer.material = Resources.Load("MovieHD");
	
}



//called in Transition2D3D
function changeSettings(b:boolean){

	plane2D.renderer.enabled=!b;
	sphere3D.renderer.enabled=b;
}



/*
* Pause video while interface 
*/

function videoHDZoomON (plane : GameObject){


	button=false;
	var controllerMovie:PlayFileBasedMovieDefault;	
	//pause movie
	controllerMovie=plane2D.GetComponent("PlayFileBasedMovieDefault");
	controllerMovie.PauseMovie ();

}

/*
* Resume video when leaving interface 
*/

function videoHDZoomQuit(plane : GameObject){

	var controllerMovie:PlayFileBasedMovieDefault;
	//resume movie
	controllerMovie=plane2D.GetComponent("PlayFileBasedMovieDefault");
	controllerMovie.ResumeMovie ();
	button=true;
	light.type=LightType.Point;
	light.range=70;
	light.intensity=0.88;
	
}


/*
* Set the parameters for the video (see the plug to know how to do it)
*/
function putVideo( focus: GameObject, nom : String){

 	var controllerIOS:ForwardiOSMessages;
	controllerIOS = iOS.GetComponent("ForwardiOSMessages");
 
	var controllerScene:SceneController;
	controllerScene = MovieController.GetComponent("SceneController");      
	
    focus.AddComponent("PlayFileBasedMovieDefault");
    focus.renderer.material = Resources.Load("Video");
    
	controllerScene.movieClass[1] =  focus.GetComponent("PlayFileBasedMovieDefault");
	controllerScene.movieClass[1].movieIndex=1;
	controllerScene.movieName[1] = nom + ".mov";
	controllerIOS.movie[1]=focus.GetComponent("PlayFileBasedMovieDefault");
	
	
	var controllerMovie:PlayFileBasedMovieDefault;
	controllerMovie=focus.GetComponent("PlayFileBasedMovieDefault");
	controllerMovie.PlayMovie(nom + ".mov");
	
	return true;
	
}

/*
* To stop the video put with putvideo (also release memory)
*/
function stopVideo(focus: GameObject){

	var controllerMovie:PlayFileBasedMovieDefault;
	controllerMovie=focus.GetComponent("PlayFileBasedMovieDefault");
	controllerMovie.StopMovie ();
	Destroy(focus.GetComponent("PlayFileBasedMovieDefault"));
	
	return true;

}

/*
* return a flag to know the video has finished
*/
function getFlagEndVideo(){
	var controllerScene:SceneController;
	controllerScene = MovieController.GetComponent("SceneController");
	return controllerScene.movieClass[0].movieFinished;
	//Trans.endingEnable();
	//return true;
}

function effectsOnEnd(){

	if(getFlagEndVideo()){
	
		Trans.endingEnable();
	}

}

function endTransition(){

	t += Time.deltaTime * rate;
	plane2D.transform.rotation = Quaternion.Slerp(startRotation, endRotation, t);

	if(t >= 1.0) {
		
		if( startRotation == rotInit ) {
		
			t = 0;
			startRotation = plane2D.transform.rotation ;
			endRotation = plane2D.transform.rotation * Quaternion.Euler(180,0,0);
			return false ;
		}
		
		return true;
	}

	return false;
}

/*
* part to hanlde zoom on a position
*/

/*
private var pos3D:Vector3;
private var prevamp:float;

function OnEnable(){

	Gesture.onPinchE += UpdateZoom;
	Gesture.onDownE +=  onDown;
	
}

function UpdateZoom(amp:float){


	
	//gameObject.transform.LookAt(pos3D);
	if(pos3D.y>-3 && pos3D.y<-10){
		if(pos3D.y>-3){pos3D.y=-3;}
		if(pos3D.y<-10){pos3D.y=-10;gameObject.transform.LookAt(Vector3.zero);}
		//gameObject.transform.Translate(pos3D*1.3);	
		if(prevamp<amp*1.1)gameObject.transform.position.y= pos3D.y+1;//3*amp/10;
		if(prevamp>amp*1.1)gameObject.transform.position.y= pos3D.y-1;//3*amp/10;
		
	}
	prevamp=amp;
}

function onDown(pos:Vector2){

	pos3D=camera.ScreenToWorldPoint(Vector3(pos.x,-10,pos.y));
	
}

*/

