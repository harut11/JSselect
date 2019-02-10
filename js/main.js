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
                    divRight = Math.abs((project.mouseNewPositionX - project.table.offset().left) - project.table.width()),
                    divBottom = Math.abs((project.mouseNewPositionY - project.table.offset().top) - project.table.height());

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
                let cellTop = $(value).position().top,
                    cellLeft = $(value).position().left;
                if(cellTop >= (endPositionY - (project.table.offset().top + 45)) && cellTop < (project.mousePositionY - project.table.offset().top) && cellLeft >= (endPositionX - (project.table.offset().left + 55)) && cellLeft < (project.mousePositionX - project.table.offset().left) || cellTop >= (endPositionY - (project.table.offset().top + 45)) && cellTop < (project.mousePositionY - project.table.offset().top) && cellLeft >= (project.mousePositionX - (project.table.offset().left + 55)) && cellLeft < (endPositionX - project.table.offset().left)) {
                    if(!$(value).hasClass('purple') && !$(value).hasClass('green')) {
                        $(value).addClass('selected');
                    }
                }
                if(cellTop >= (project.mousePositionY - (project.table.offset().top + 45)) && cellTop < (endPositionY - project.table.offset().top) && cellLeft >= (endPositionX - (project.table.offset().left + 55)) && cellLeft < (project.mousePositionX - project.table.offset().left) || cellTop >= (project.mousePositionY - (project.table.offset().top + 45)) && cellTop < (endPositionY - project.table.offset().top) && cellLeft >= (project.mousePositionX - (project.table.offset().left + 55)) && cellLeft < (endPositionX - project.table.offset().left)) {
                    if(!$(value).hasClass('purple') && !$(value).hasClass('green')) {
                        $(value).addClass('selected');
                    }
                }
            });
        });

        $(window).mouseup(() => {
            $('.selectDiv').remove();
        });

    },

    selectMethods: () => {
        $(document).on('change', $('#selectAll'), () => {
            $.each($('.dinamicCell'), (key, value) => {
                $(value).toggleClass('selected');
                if($(value).hasClass('purple') || $(value).hasClass('green')) {
                    $(value).toggleClass('selected');
                }
            })
        }) ;

        $('#purple').click(() => {
            let cell = $('.dinamicCell');
            $.each(cell, (key, value) => {
                if($(value).hasClass('selected')) {
                    $(value).removeClass('selected').toggleClass('purple');
                }
            });
            if($(cell).hasClass('green')) {
                toastr.error('Cell(s) are already marked!');
            }
        });

        $('#green').click(() => {
            let cell = $('.dinamicCell');
            $.each(cell, (key, value) => {
                if($(value).hasClass('selected')) {
                    $(value).removeClass('selected').toggleClass('green');
                }
            });
            if($(cell).hasClass('purple')) {
                toastr.error('Cell(s) are already marked!');
            }
        });
    }
};
toastr.options.closeButton = true;
project.initDivs();
project.selectMethods();
project.drawSelect();