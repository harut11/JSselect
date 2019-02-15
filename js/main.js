let project = {
    table: $('#table'),
    dynamic: $('#cells'),
    mousePositionX: 0,
    mousePositionY: 0,
    mouseNewPositionX: 0,
    mouseNewPositionY: 0,
    arr1: [],
    arr2: [],

    initDivs: () => {
        let html = '';

        for(let i = 1; i <= 171; i++) {
            html = '<div class="cell dynamicCell" data-id="' + i + '">-</div>';

            project.dynamic.append(html);
        }
    },

    drawSelect: () => {
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

        $(document).on('click', '#table .dynamicCell', (event) => {
            $('#selectAll').prop('checked', false);
            let cells = $(event.target);
            // todo remove all from local storage
            let cell = project.arr1,
                local2 = project.arr2,
                startCell2 = +cell[cell.length - 1].cellDataId,
                forShiftCell = +local2[0].forShiftCell,
                dynamicCell = $('.dynamicCell');

            if(!shiftPressed) {
                dynamicCell.removeClass('last');
                cells.addClass('last');
            }

            if(shiftPressed && !ctrlPressed) {
                dynamicCell.removeClass('selected');
            }

            if(!shiftPressed && !ctrlPressed) {
                project.deleteSelected();
                cells.addClass('selected');
            } else if(shiftPressed) {
                if(cells.hasClass('selected')) {
                    cells.toggleClass('selected');
                }

                $.each(dynamicCell, (key, value) => {
                    let valCellId = +$(value).attr('data-id');
                    if(valCellId <= forShiftCell && valCellId >= startCell2 && startCell2 < forShiftCell || valCellId >= forShiftCell && valCellId <= startCell2 && startCell2 > forShiftCell) {
                        $(value).addClass('selected');
                    }
                });
            } else if(ctrlPressed) {
                cells.addClass('selected');
            }

        });

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
            if(!ctrlPressed && !shiftPressed) {
                project.deleteSelected();
            }

            let endPositionX = e2.pageX,
                endPositionY = e2.pageY,
                dynamicCell = $('.dynamicCell'),
                local = project.arr1,
                local2 = project.arr2,
                cellDataid = $(e2.target).attr('data-id'),
                forShiftCell = null;

            local.push({
                cellDataId: cellDataid
            });

            if(!forShiftCell) {
                forShiftCell = cellDataid;
            }

            if(!shiftPressed) {
                local2.push({
                    forShiftCell: forShiftCell,
                });
                if(local2.length > 1) {
                    local2.shift();
                }
            }

            if(local.length > 2) {
                local.shift();
            }

            $.each(dynamicCell, (key, value) => {
                let cellTop = $(value).position().top,
                    cellLeft = $(value).position().left,
                    cellsTop = dynamicCell.position().top,
                    cellsLeft = dynamicCell.position().left,
                    tableTop = project.table.offset().top,
                    tableLeft = project.table.offset().left;

                if(cellTop >= (endPositionY - (tableTop + cellsTop))
                    && cellTop < (project.mousePositionY - tableTop)
                    && cellLeft >= (endPositionX - (tableLeft + cellsLeft))
                    && cellLeft < (project.mousePositionX - tableLeft)
                    || cellTop >= (endPositionY - (tableTop + cellsTop))
                    && cellTop < (project.mousePositionY - tableTop)
                    && cellLeft >= (project.mousePositionX - (tableLeft + cellsLeft))
                    && cellLeft < (endPositionX - tableLeft))
                {
                    $(value).addClass('selected');
                }
                if(cellTop >= (project.mousePositionY - (tableTop + cellsTop))
                    && cellTop < (endPositionY - tableTop)
                    && cellLeft >= (endPositionX - (tableLeft + cellsLeft))
                    && cellLeft < (project.mousePositionX - tableLeft)
                    || cellTop >= (project.mousePositionY - (tableTop + cellsTop))
                    && cellTop < (endPositionY - tableTop)
                    && cellLeft >= (project.mousePositionX - (tableLeft + cellsLeft))
                    && cellLeft < (endPositionX - tableLeft))
                {
                    $(value).addClass('selected');
                }
            });
        });

        $(window).mouseup(() => {
            $('.selectDiv').remove();
        });

        $(document).on('click', 'body', (event) => {
            if(event.target.id !== 'table' && !$(event.target).is('.dynamicCell') && !$(event.target).is('#cells') && !$(event.target).is('#selectAll')) {
                $('.dynamicCell').removeClass('selected');
                $('#selectAll').prop('checked', false);
            }
        })

    },

    deleteSelected: () => {
      $('.dynamicCell').removeClass('selected');
    },

    selectMethods: () => {
        $(document).on('change', $('#selectAll'), () => {
            if($('#selectAll').prop('checked') === true) {
                $.each($('.dynamicCell'), (key, value) => {
                    if($(value).hasClass('purple') || $(value).hasClass('green')) {
                        $(value).toggleClass('selected');
                    }  else {
                        $(value).addClass('selected');
                    }
                });
            }else {
                project.deleteSelected();
            }

        });


        $('#purple').click(() => {
            let cell = $('.dynamicCell'),
                marked = false;

            $.each(cell, (key, value) => {
                if($(value).hasClass('selected') || $(value).hasClass('purple') && !marked) {
                    $(value).removeClass('selected').removeClass('green').addClass('purple');
                    marked = true;
                }
            });

            if(!marked ) {
                toastr.error('Please select cell(s) before mark it');
            } else {
                toastr.clear();
                toastr.success('Cell(s) are marked');
            }

            $('#selectAll').prop('checked', false);
        });

        $('#green').click(() => {
            let cell = $('.dynamicCell'),
                marked = false;

            $.each(cell, (key, value) => {
                if($(value).hasClass('selected') || $(value).hasClass('green') && !marked) {
                    $(value).removeClass('selected').removeClass('purple').addClass('green');
                    marked = true;
                }
            });

            if(!marked) {
                toastr.error('Please select cell(s) before mark it');
            } else {
                toastr.clear();
                toastr.success('Cell(s) are marked');
            }

            $('#selectAll').prop('checked', false);
        });

        $('#reset').click(() => {
            $('.dynamicCell').removeClass('selected').removeClass('green').removeClass('purple');
            $('#selectAll').prop('checked', false);
        })
    },
};
toastr.options.closeButton = true;
project.initDivs();
project.drawSelect();
project.selectMethods();