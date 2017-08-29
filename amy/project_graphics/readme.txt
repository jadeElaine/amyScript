So, "#" is supposed to mark a line as a comment, but there seems to be a bug in that, so i'm sticking some minimal documentation here:


# variables are constants by default, mutable allows a variable to be changed
mutable Vector2D position(100,100);

# on_load is an embedded function used by akiamy.exe when the program finishes loading
# Nil functions do not need returns
Function on_load <Nil> () {

    # This is a function that will tell the program not to draw the mouse cursor over the play window
    # It will allow us to draw our own without windows interfering
    input_hide_mouse();
};

# on_update is called by akiamy.exe once every frame, and false can be returned to end the program
# The framerate is artificially limited to stay below 60fps maximum, so as not to overtax the CPU
Function on_update <Boolean> () {

    # Simple way to quit
    if( input_press( escape ) )
    {
        return false;
    }

    # Discrete up/down movement
    if( input_press( up ) )
    {
        position.y -= 10;
    }
    if( input_press( down ) )
    {
        position.y += 10;
    }

    return true;
};

# on_2d is called by akiamy.exe once per frame, from within the an internal openGL orthographic context
# tl;dr of that is: you can draw stuff here using the graphics functions and it will animate at ~60fps
Function on_2d <Nil> () {  
    # the box function takes a position, a size, and a color, in this case the whole screen is painted blue
    graphics_box( IntegerVector2D(0,0), graphics_get_resolution(), Color(blue) );

    Integer screenCenter(graphics_get_resolution().x()/2);
    # graphical print takes a position, a string to be displayed, and a color
    # here, the position is entered as two number, rather than a single vector class
    # I'm currently designing all vector classes to use numbers/vectors interchangibly
    graphics_print_centered( screenCenter, 8, "Press escape to quit", white );
    
    # ...if you're curious about Color(blue) vs white, technically white is not a color,
    # but rather a text string.  graphics_print is smart enough to understand that a string
    # when entered as the last parameter is meant to be interpreted as a color.  The other 
    # graphics functions currently have a bug on this which I'll fix when i can.
    
    # one way to move an object is to use the mousecursor's position
    # the graphics_line function will draw a single colored line between one position and another
    IntegerVector2D mouseCursor( input_cursor() );
    graphics_line(mouseCursor, mouseCursor + IntegerVector2D(-10, 5), Color(yellow) );
    graphics_line(mouseCursor, mouseCursor + IntegerVector2D(10, 5), Color(yellow) );
    graphics_line(mouseCursor, mouseCursor + IntegerVector2D(0, -10), Color(yellow) );
    
    # currently there is a bug where all non-mutable variables must be declared like so:
    #    "Type name( initialValue );"
    # rather than the more natural standard:
    #    "Type name = initialValue;"
    #
    # ... This paradigm is more convinient for compact constructions like Vector2D position(100,100),
    # but imo laborious for IntegerVector2D mouseCursor( input_cursor() )
    # the issue is that "=" is considered to happen after the variable is created, which
    # is too late to edit a non-mutable variable.  I hope to work out this bug soon
       
    # this will draw a box at the position coordinates
    # note that the size of the box can be a single number instead of a vector, to draw squares
    graphics_box_centered( position, 20, Color(red) );
    graphics_box_centered( position, 10, Color(yellow) );    
};