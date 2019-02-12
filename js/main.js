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
                dinamicCell = $('.dinamicCell'),
                local = JSON.parse(localStorage.getItem('local')),
                cellDataid = $(e2.target).attr('data-id'),
                rowDataId = $(e2.target).closest('.row').attr('data-id');

            if(!local) {
                local = [];
            }

            local.push({
                rowDataId: rowDataId,
                cellDataId: cellDataid
            });

            localStorage.setItem('local', JSON.stringify(local));

            $.each(dinamicCell, (key, value) => {
                let cellTop = $(value).position().top,
                    cellLeft = $(value).position().left,
                    cellsTop = dinamicCell.position().top,
                    cellsLeft = dinamicCell.position().left;

                if(cellTop >= (endPositionY - (project.table.offset().top + cellsTop)) && cellTop < (project.mousePositionY - project.table.offset().top) && cellLeft >= (endPositionX - (project.table.offset().left + cellsLeft)) && cellLeft < (project.mousePositionX - project.table.offset().left) || cellTop >= (endPositionY - (project.table.offset().top + cellsTop)) && cellTop < (project.mousePositionY - project.table.offset().top) && cellLeft >= (project.mousePositionX - (project.table.offset().left + cellsLeft)) && cellLeft < (endPositionX - project.table.offset().left)) {
                    $(value).addClass('selected');
                }
                if(cellTop >= (project.mousePositionY - (project.table.offset().top + cellsTop)) && cellTop < (endPositionY - project.table.offset().top) && cellLeft >= (endPositionX - (project.table.offset().left + cellsLeft)) && cellLeft < (project.mousePositionX - project.table.offset().left) || cellTop >= (project.mousePositionY - (project.table.offset().top + cellsTop)) && cellTop < (endPositionY - project.table.offset().top) && cellLeft >= (project.mousePositionX - (project.table.offset().left + cellsLeft)) && cellLeft < (endPositionX - project.table.offset().left)) {
                    $(value).addClass('selected');
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
            let cell = $('.dinamicCell'),
                marked = false;
            $.each(cell, (key, value) => {
                if($(value).hasClass('selected') || $(value).hasClass('purple')) {
                    $(value).removeClass('selected').removeClass('green').addClass('purple');
                }
                if($(value).hasClass('purple') && !marked) {
                    marked = true;
                }
            });
            if(!marked) {
                toastr.error('Please select cell(s) before mark it');
            }
        });

        $('#green').click(() => {
            let cell = $('.dinamicCell'),
                marked = false;
            $.each(cell, (key, value) => {
                if($(value).hasClass('selected') || $(value).hasClass('green')) {
                    $(value).removeClass('selected').removeClass('purple').addClass('green');
                }
                if($(value).hasClass('green') && !marked) {
                    marked = true;
                }
            });
            if(!marked) {
                toastr.error('Please select cell(s) before mark it');
            }
        });

        let shiftPressed = false,
            ctrlPressed = false;

        $(document).on('keydown', (event) => {
            if(event.which === 16 && !shiftPressed) {
                shiftPressed = true;
            }
            if(event.which === 17 && !ctrlPressed) {
                ctrlPressed = true;
            }
        });

        $(document).on('keyup', (event) => {
            if(event.which === 16) {
                shiftPressed = false;
            }
            if(event.which === 17) {
                ctrlPressed = false;
            }
        });

        $('body').on('click', (event) => {
            if(($(event.target).closest('.row').length) || event.target.id === "table") {
                return false;
            } else {
                localStorage.removeItem('local');
            }
        });

        $(document).on('click', '#table .dinamicCell', (event) => {
            let cells = $(event.target);

            if(!ctrlPressed || !shiftPressed) {
                $('.dinamicCell').removeClass('selected');
                cells.addClass('selected');
            }
            if(ctrlPressed) {
                cells.addClass('selected');
            }

            if(shiftPressed) {
                let cell = JSON.parse(localStorage.getItem('local')),
                    lastItem = cell.length - 2,
                    startRowId = +cell[lastItem].rowDataId,
                    startCellId = +cell[lastItem].cellDataId,
                    endRowId = +cells.closest('.row').attr('data-id'),
                    endCellId = +cells.attr('data-id'),
                    dinamicCell = $('.dinamicCell');
                    console.log(startRowId, startCellId);

                    $.each(dinamicCell, (key, value) => {
                        let valCellId = +$(value).attr('data-id'),
                            valRowId = +$(value).closest('.row').attr('data-id');

                       if(valCellId > endCellId && valRowId === endRowId || valRowId > endRowId && valRowId < startRowId || valCellId < startCellId && valRowId === startRowId) {
                           $(value).addClass('selected');
                       }
                       if(valCellId < endCellId && valRowId === endRowId || valRowId > startRowId && valRowId < endRowId || valCellId > startCellId && valRowId === startRowId) {
                           $(value).addClass('selected');
                       }
                    });
            }
        });
    },
};
toastr.options.closeButton = true;
project.initDivs();
project.drawSelect();
project.selectMethods();