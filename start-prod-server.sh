#! /bin/bash
 
while true
do
# ((i++))
    if curl -If "http://rahat_backend:3601/api/v1/app/settings"; then
        echo "rahat server is ready";
        yarn production;
        break;
    else
        echo "rahat server is not ready";
        sleep 5;
    fi
done