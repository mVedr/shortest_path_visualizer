#!/usr/bin/env python3

import time

import redis
import rospy
import socketio
from geometry_msgs.msg import Twist
from std_msgs.msg import Float32, Float64, String

r = redis.Redis(host='localhost',port=6379,)

# Initialize ROS node
rospy.init_node('cmd_vel_publisher')

# Define the publisher for cmd_vel topic
pub = rospy.Publisher('cmd_vel', Twist, queue_size=10)

sio = socketio.Client()

path = []
serverTag = 0
rosTag = 0
curr_serverdir = -1
curr_fwd = 0
rosAngle= 0.0
targetAngle = 0.0
badAngle = 0.0
moveToOrigin = True
prevAngle = 0
#(plan, fraction) = move_group.compute_cartesian_path(waypoints, eef_step = 0.01, jump_threshold = 0.0)

# @sio.event is an important function which will handle the event and will make it connect to the server. When the server starts,
# it will get connected to the server.

def ignoreFunc(rosAngle )->bool:
    numstr = str(rosAngle)
    arr = numstr.split(".")
    if len(arr)<=1:
        return True
    if len(arr[1])>2:
        return False
    return True

@sio.event
def connect():
    print('Connected to server')
    main()

twist_msg = Twist()

@sio.event
def start(arg):
    global path
    path = arg
    global vis
    vis = [False]*len(path)
    print(path)

    # Simulation
    for index, point in enumerate(path):
        #time.sleep(index * 3.5)
        #combined_tag_callback(data,point['tag'],point['data'])
        print(point['tag'])
        global targetAngle
        global rosAngle
        global badAngle
        badAngle = rosAngle
        targetAngle = rosAngle
        global moveToOrigin
        moveToOrigin = True
        if point['dir']==0:
            targetAngle = rosAngle
        elif point['dir']==1:
            if targetAngle + 90.0 > 360.0:
                targetAngle -= 360.0
            targetAngle = (targetAngle+90.0)
            badAngle += 90.0
        elif point['dir']==2:
            targetAngle = (targetAngle-90.0)
            badAngle -= 90.0
            if targetAngle<0.0:
                targetAngle += 360.0
        elif point['dir']==3:
            if targetAngle + 180.0 > 360.0:
                targetAngle -= 360.0
            targetAngle = (targetAngle+180.0)
            badAngle += 180.0
            print(badAngle," ",targetAngle)
        
        global curr_serverdir
        global serverTag
        global curr_fwd
        curr_serverdir = int(point['dir'])
        serverTag = point['tag']
        curr_fwd = int(point['fwd'])
        
        sio.emit("coordinates", point)
#        time.sleep(60)
        # signal()
        if index == len(path) - 1:
            r.set("currForward",curr_fwd)
            curr_serverdir = -1
            twist_msg.linear.x = 0.0
            twist_msg.angular.z = 0.0
            sio.emit("endS",curr_fwd)
        else:
        
            while True:
                global rosTag
                #print("ROSTAG: ",rosTag)
                #print("PointTag: ",point['tag'])
                curRt = rosTag
                if curRt != point['tag'] and len(curRt)<5:
                   # print("ROS TAG: ",rosTag)
                    print("Point Tag:",point['tag'])
                    print("Breaking Tag:",curRt)
                    print(point['tag'],curRt,point['tag']==curRt)
                    print("Length:" ,len(rosTag))
                    break




def main():

    # Define the subscriber for CombinedTagData topic
    sub1 = rospy.Subscriber('qrCode', String, combined_tag_callback, queue_size=10)

    sub2 = rospy.Subscriber('angle',Float32, direction, queue_size=10)

    # Define the Twist message
    twist_msg = Twist()

    #rospy.spin()

    # Set the publishing rate
    rate = rospy.Rate(10)  # Adjust the publishing rate as needed

    while not rospy.is_shutdown():
        rate.sleep()

def combined_tag_callback(data):
    first_tag = str(data)
    global serverTag, rosTag
    extr = first_tag.split()
    extr = extr[1][1:len(extr[1])-1]
    #print("extr: ",extr
    rosTag = extr
    #print("currTag",serverTag)
    if extr == serverTag:
        #direction(curr_serverdir)
        NotCallBackDirectionFunction()

    else:
        twist_msg.linear.x = 0.0  

    twist_msg.angular.z = 0.0

    # Publish the Twist message
    pub.publish(twist_msg)

def direction(data):
    # print("currDir :",curr_serverdir)
    lang = data
    #print("data: ",lang)
    ff = str(lang)
    ff = ff.split()
    ff = float(ff[1])
    global rosAngle
    rosAngle= ff
    # print("ff: ",ff)



def NotCallBackDirectionFunction():
    global targetAngle, rosAngle
  #  print("ncb angle: ",rosAngle)
    print("RECEIVED DIRECTION: ",curr_serverdir)
    global moveToOrigin
    global prevAngle
    print("MOVE_ORIGIN: ",moveToOrigin)
    if curr_serverdir == -1:
        twist_msg.linear.x = 0.0
        twist_msg.angular.z = 0.0


    elif curr_serverdir == 0:

        twist_msg.linear.x = 0.3 # Adjust linear velocity value as needed for tag "a1s"


    elif curr_serverdir == 1:
        print("ROBOT ANGLE: ",targetAngle)
        print("ROS ANGLE: ",rosAngle)
        print("BAD ANGLE: ",badAngle)
        if badAngle <360.0:
            if targetAngle > rosAngle:
                twist_msg.angular.z = -1.8
            else:
                twist_msg.angular.z = 0
                twist_msg.linear.x = 0.3
        elif badAngle > 360.0:
            # 1) take to 0 +  delta
            # 2) repeat above
            if moveToOrigin:
                twist_msg.angular.z =-1.8
                if rosAngle > 0.0 and rosAngle < 90.0:
                    if ignoreFunc(rosAngle=rosAngle)==False:
                        
                    # if rosAngle == 2.0:
                    #     return
                        moveToOrigin = False
                   # return
            else:
                if targetAngle > rosAngle:
                    twist_msg.angular.z = -1.8
                else:
                    twist_msg.angular.z = 0 
                    twist_msg.linear.x = 0.3
        prevAngle = int(rosAngle)


    elif curr_serverdir == 2:
        # global moveToOrigin
        print("ROBOT ANGLE: ",targetAngle)
        print("ROS ANGLE: ",rosAngle)
        print("BAD ANGLE: ",badAngle)
        if badAngle>0.0:
            if targetAngle < rosAngle:
                twist_msg.angular.z = 1.8
            else:
                twist_msg.angular.z = 0
                twist_msg.linear.x = 0.3
        else:
            if moveToOrigin:
                twist_msg.angular.z =1.8
                if rosAngle > 357.0:
                    if ignoreFunc(rosAngle=rosAngle)==False:
                        moveToOrigin = False
                    #return
            else:
                if targetAngle < rosAngle:
                    twist_msg.angular.z = 1.8
                else:
                    twist_msg.angular.z = 0
                    twist_msg.linear.x = 0.3


    elif curr_serverdir == 3:
        print("ROBOT ANGLE: ",targetAngle)
        print("ROS ANGLE: ",rosAngle)
        print("BAD ANGLE: ",badAngle)
        # global moveToOrigin
        if badAngle <360.0:
            if targetAngle > rosAngle:
                twist_msg.angular.z =-1.8
            else:
                twist_msg.angular.z = 0
                twist_msg.linear.x = 0.3
        elif badAngle > 360.0:
            # 1) take to 0 +  delta
            # 2) repeat above
            if moveToOrigin:
                twist_msg.angular.z =-1.8
                if rosAngle > 0.0 and rosAngle<90.0:
                    moveToOrigin = False
                    return
            else:
                if targetAngle > rosAngle:
                    twist_msg.angular.z =-1.8
                else:
                    twist_msg.angular.z = 0
                    twist_msg.linear.x = 0.3


    # Publish the Twist message
    pub.publish(twist_msg)


def reached_target_point(point):
    # Check if the robot has reached the target point
    # You need to implement this based on your robot's feedback mechanism
    # For example, you might check if the robot's current position matches the target point
    # Return True if the robot has reached the target point, otherwise return False
    return False


sio.connect('http://localhost:3003')

sio.wait()  # Keep the WebSocket connection alive and listening

if __name__ == '_main_':
    try:
        main()
    except rospy.ROSInterruptException:
        pass