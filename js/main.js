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
            // console.log(project.mousePositionX, project.mousePositionY);
            html = '<div class="selectDiv"></div>';
            project.table.append(html);

            project.table.mousemove((event) => {
                project.mouseNewPositionX = event.pageX;
                project.mouseNewPositionY = event.pageY;
                // console.log(project.mouseNewPositionX);
                // console.log(project.mouseNewPositionY);

                let div = $('.selectDiv'),
                    divWidth = project.mouseNewPositionX - project.mousePositionX,
                    divHeight = project.mouseNewPositionY - project.mousePositionY,
                    divTop = project.mouseNewPositionY - project.table.offset().top,
                    divLeft = project.mouseNewPositionX - project.table.offset().left,
                    divRight = Math.abs((project.mouseNewPositionX - project.table.position().left) - project.table.width()),
                    divBottom = Math.abs((project.mouseNewPositionY - project.table.position().top) - project.table.height());

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

        project.table.mouseup((e2) => {
            let endPositionX = e2.pageX,
                endPositionY = e2.pageY;

            $.each($('.dinamicCell'), (key, value) => {
                if($(value).position().top >= (endPositionY - project.table.offset().top) && $(value).position().top < Math.abs(endPositionY - project.mousePositionY) && $(value).position().left >= (endPositionX - project.table.offset().left) && $(value).position().left < Math.abs(endPositionX - project.mousePositionX)) {
                    $(value).addClass('selected');
                }
                if($(value).position().top >= (project.table.offset().top - endPositionY) && $(value).position().top < Math.abs(project.mousePositionY - endPositionY) && $(value).position().left >= (project.table.offset().left - endPositionX) && $(value).position().left < Math.abs(project.mousePositionX - endPositionX)) {
                    $(value).addClass('selected');
                }
            });
            console.log(project.mousePositionX, project.mousePositionY);
            console.log(endPositionX, endPositionY);
        });

        $(window).mouseup(() => {
            $('.selectDiv').remove();
        });

    },

    selectMethods: () => {
        $(document).on('change', $('#selectAll'), () => {
            $('.dinamicCell').toggleClass('selected');
        }) ;

        $('#purple').click(() => {
            $.each($('.dinamicCell'), (key, value) => {
                if($(value).hasClass('selected')) {
                    $(value).removeClass('selected').toggleClass('purple');
                }
            })
        });

        $('#green').click(() => {
            $.each($('.dinamicCell'), (key, value) => {
                if($(value).hasClass('selected')) {
                    $(value).removeClass('selected').toggleClass('green');
                }
            })
        });
    }
};
project.initDivs();
project.selectMethods();
project.drawSelect();