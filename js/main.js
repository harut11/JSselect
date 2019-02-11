// sh = false;
//
// $(document).on('keydown', function(evt) {
//    if (evt.which === 16) {
//        sh = true;
//    }
// });
// $(document).on('keyup', function(evt) {
//    if (evt.which === 16) {
//        sh = false;
//    }
// });
//
//
// $(document).on('click', function() {
//     if (sh) {
//         console.log('shift click');
//     } else {
//         console.log('simple click');
//     }
// });


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
        project.table.mousedown((e1) => {
            project.mousePositionX = e1.pageX;
            project.mousePositionY = e1.pageY;
            html = '<div class="selectDiv"></div>';
            project.table.append(html);

            project.table.mousemove((event) => {
                project.mouseNewPositionX = event.pageX;
                project.mouseNewPositionY = event.pageY;

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
                endPositionY = e2.pageY,
                dinamicCell = $('.dinamicCell');

            $.each(dinamicCell, (key, value) => {
                let cellTop = $(value).position().top,
                    cellLeft = $(value).position().left,
                    cellsTop = dinamicCell.position().top,
                    cellsLeft = dinamicCell.position().left;

                if(cellTop >= (endPositionY - (project.table.offset().top + cellsTop)) && cellTop < (project.mousePositionY - project.table.offset().top) && cellLeft >= (endPositionX - (project.table.offset().left + cellsLeft)) && cellLeft < (project.mousePositionX - project.table.offset().left) || cellTop >= (endPositionY - (project.table.offset().top + cellsTop)) && cellTop < (project.mousePositionY - project.table.offset().top) && cellLeft >= (project.mousePositionX - (project.table.offset().left + cellsLeft)) && cellLeft < (endPositionX - project.table.offset().left)) {
                    if(!$(value).hasClass('purple') && !$(value).hasClass('green')) {
                        $(value).addClass('selected');
                    }
                }
                if(cellTop >= (project.mousePositionY - (project.table.offset().top + cellsTop)) && cellTop < (endPositionY - project.table.offset().top) && cellLeft >= (endPositionX - (project.table.offset().left + cellsLeft)) && cellLeft < (project.mousePositionX - project.table.offset().left) || cellTop >= (project.mousePositionY - (project.table.offset().top + cellsTop)) && cellTop < (endPositionY - project.table.offset().top) && cellLeft >= (project.mousePositionX - (project.table.offset().left + cellsLeft)) && cellLeft < (endPositionX - project.table.offset().left)) {
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

        let shiftPressed = false,
            ctrlPressed = false;

        $(window).keydown((event) => {
            if(event.which === 16) {
                shiftPressed = true;
            }
            if(event.which === 17) {
                ctrlPressed = true;
            }

            if(shiftPressed) {
                project.table.mousedown((event) => {
                    let startSelectY = event.pageY,
                        startSelectX = event.pageX,
                        cell = JSON.parse(localStorage.getItem('cell'));

                    if(!cell) {
                        cell = [];
                    }

                    cell.push({
                        selectY: startSelectY,
                        selectX: startSelectX,
                    });

                    if(cell.length > 2) {
                        return false;
                    }

                    localStorage.setItem('cell', JSON.stringify(cell));

                    if(cell.length === 2) {
                        let startSelectY = cell[0].selectY,
                            startSelectX = cell[0].selectX,
                            endSelectY = cell[1].selectY,
                            endSelectX = cell[1].selectX,
                            dinamicCell = $('.dinamicCell');

                        $.each(dinamicCell, (key, value) => {
                            let cellTop = $(value).position().top,
                                cellLeft = $(value).position().left,
                                cellsTop = dinamicCell.position().top,
                                cellsLeft = dinamicCell.position().left;

                            if(cellTop >= (endSelectY - (project.table.offset().top + cellsTop)) && cellTop < (startSelectY - project.table.offset().top) && cellLeft >= (endSelectX - (project.table.offset().left + cellsLeft)) && cellLeft < (startSelectX - project.table.offset().left) || cellTop >= (endSelectY - (project.table.offset().top + cellsTop)) && cellTop < (startSelectY - project.table.offset().top) && cellLeft >= (startSelectX - (project.table.offset().left + cellsLeft)) && cellLeft < (endSelectX - project.table.offset().left)) {
                                if(!$(value).hasClass('purple') && !$(value).hasClass('green')) {
                                    $(value).addClass('selected');
                                }
                                localStorage.removeItem('cell');
                            }
                            if(cellTop >= (startSelectY - (project.table.offset().top + cellsTop)) && cellTop < (endSelectY - project.table.offset().top) && cellLeft >= (endSelectX - (project.table.offset().left + cellsLeft)) && cellLeft < (startSelectX - project.table.offset().left) || cellTop >= (startSelectY - (project.table.offset().top + cellsTop)) && cellTop < (endSelectY - project.table.offset().top) && cellLeft >= (startSelectX - (project.table.offset().left + cellsLeft)) && cellLeft < (endSelectX - project.table.offset().left)) {
                                if(!$(value).hasClass('purple') && !$(value).hasClass('green')) {
                                    $(value).addClass('selected');
                                }
                                localStorage.removeItem('cell');
                            }
                        });
                    }
                });
            }
            if(ctrlPressed) {
                $.each($('.dinamicCell'), (key, value) => {
                    $(value).click(() => {
                        $(value).addClass('selected');
                    });
                });
            }
        }).keyup((event2) => {
            if(event2.which === 16) {
                shiftPressed = false;
            }
            if(event2.which === 17) {
                ctrlPressed = false;
            }
            // if(!ctrlPressed) {
            //     project.table.click(() => {
            //        $('.dinamicCell').removeClass('selected');
            //     });
            // }
        });
    }
};
toastr.options.closeButton = true;
project.initDivs();
project.selectMethods();
project.drawSelect();