$("button#run_toggle").click(function(){
  toggleRunning()
  if (IS_RUNNING){
    //turn into pause button
    $(this).html('<i class="fa fa-pause"></i> Pause');
    
  }else{
    //turn into play button
    $(this).html('<i class="fa fa-play"></i> Play');
    
  }
});