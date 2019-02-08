let project = {
    table: $('#table'),
    dinamic: $('.dinamic'),
    mousePositionX: 0,
    mousePositionY: 0,
    mouseNewPositionX: 0,
    mouseNewPositionY: 0,

    initDivs: () => {
        html = '';

        for(let i = 1; i <= 19; i++) {
            html = '<div class="cell dinamicCell" data-id="' + i + '">-</div>';

            project.dinamic.append(html);
        }
    },

    drawSelect: () => {
        project.table.mousedown((e1) =>{
            project.mousePositionX = e1.pageX;
            project.mousePositionY = e1.pageY;
            console.log(project.mousePositionX, project.mousePositionY);
            html = '<div class="selectDiv"></div>';
            project.table.append(html);

            project.table.mouseover((event) => {
                let eventDoc, doc, body;

                if(event.pageX == null && event.clientX != null) {
                    eventDoc = project.table;
                    doc = eventDoc.documentElement;
                    body = eventDoc.body;

                    event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                        (doc && doc.clientLeft || body && body.scrollLeft || 0);
                    event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) -
                        (doc && doc.clientTop || body && body.clientTop || 0);
                }
                project.mouseNewPositionX = event.pageX;
                project.mouseNewPositionY = event.pageY;

                let div = $('.selectDiv'),
                    divWidth = (project.mouseNewPositionX - project.mousePositionX),
                    divHeight = project.mouseNewPositionY - project.mousePositionY,
                    divTop = project.mouseNewPositionY - project.table.position().top,
                    divLeft = project.mouseNewPositionX - project.table.position().left,
                    divRight = Math.abs(project.mouseNewPositionX - project.table.position().left - project.table.width()),
                    divBottom = Math.abs(project.mouseNewPositionY - project.table.position().top - project.table.height());

                div.css('width', Math.abs(divWidth));
                div.css('height', Math.abs(divHeight));
                if(project.mouseNewPositionX < project.mousePositionX) {
                    div.css('left', divLeft);
                }
                if(project.mouseNewPositionX > project.mousePositionX) {
                    div.css('right', divRight);
                }
                if(project.mouseNewPositionY < project.mousePositionY) {
                    div.css('top', divTop);
                }
                if(project.mouseNewPositionY > project.mousePositionY) {
                    div.css('bottom', divBottom);
                }
            });
        });

        $(window).mouseup(() => {
            $('.selectDiv').remove();
        });

    },
};
project.initDivs();
project.drawSelect();