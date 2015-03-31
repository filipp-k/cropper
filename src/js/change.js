  prototype.change = function () {
    var dragType = this.dragType,
        canvas = this.canvas,
        container = this.container,
        maxWidth = container.width,
        maxHeight = container.height,
        cropBox = this.cropBox,
        width = cropBox.width,
        height = cropBox.height,
        left = cropBox.left,
        top = cropBox.top,
        right = left + width,
        bottom = top + height,
        renderable = true,
        aspectRatio = this.options.aspectRatio,
        range = {
          x: this.endX - this.startX,
          y: this.endY - this.startY
        },
        offset;

    if (aspectRatio) {
      range.X = range.y * aspectRatio;
      range.Y = range.x / aspectRatio;
    }

    switch (dragType) {
      // Move cropBox
      case 'all':
        left += range.x;
        top += range.y;

        // correction
        if (!this.options.strict && this.options.strictCropBox) {
          if (left < canvas.left) {
            left = canvas.left;
          } else if (left + width > canvas.left + canvas.width) {
            left = (canvas.left + canvas.width) - width;
          }

          if (top < canvas.top) {
            top = canvas.top;
          } else if (top + height > canvas.top + canvas.height) {
            top = (canvas.top + canvas.height) - height;
          }
        }

        break;

      // Resize cropBox
      case 'e':
        range.maxX = container.width - right;

        if (aspectRatio) {
          if (top < container.height - bottom) {
            range.maxX = Math.min(range.maxX, top * aspectRatio);
          } else {
            range.maxX = Math.min(range.maxX, (container.height - bottom) * aspectRatio);
          }
        }

        if (!this.options.strict && this.options.strictCropBox) {
          canvas.right = canvas.left + canvas.width;
          range.maxX = Math.min(range.maxX, canvas.right - right);

          if (aspectRatio) {
            canvas.bottom = canvas.top + canvas.height;

            if (top - canvas.top < canvas.bottom - bottom) {
              range.maxX = Math.min(range.maxX, (top - canvas.top) * aspectRatio);
            } else {
              range.maxX = Math.min(range.maxX, (canvas.bottom - bottom) * aspectRatio);
            }
          }
        }

        if (range.x > range.maxX) {
          range.x = range.maxX;
          if (aspectRatio) {
            range.Y = range.x / aspectRatio;
          }
        }

        width += range.x;

        if (aspectRatio) {
          height = width / aspectRatio;
          top -= range.Y / 2;
        }

        if (width < 0) {
          dragType = 'w';
          left += width;
          width = -width;
          // todo: recalculate top and height
        }

        break;

      case 'n':
        range.minY = -top;

        if (aspectRatio) {
          if (left < container.width - right) {
            range.minY = Math.max(range.minY, -left * aspectRatio);
          } else {
            range.minY = Math.max(range.minY, -(container.width - right) * aspectRatio);
          }
        }

        if (!this.options.strict && this.options.strictCropBox) {
          range.minY = Math.max(range.minY, canvas.top - top);

          if (aspectRatio) {
            canvas.right = canvas.left + canvas.width;
            if (left - canvas.left < canvas.right - right) {
              range.minY = Math.max(range.minY, -(left - canvas.left) * aspectRatio);
            } else {
              range.minY = Math.max(range.minY, -(canvas.right - right) * aspectRatio);
            }
          }
        }

        if (range.y < range.minY) {
          range.y = range.minY;
          if (aspectRatio) {
            range.X = range.y * aspectRatio;
          }
        }

        height -= range.y;
        top += range.y;

        if (aspectRatio) {
          width = height * aspectRatio;
          left += range.X / 2;
        }

        if (height < 0) {
          dragType = 's';
          top += height;
          height = -height;
          // todo: recalculate left and width
        }

        break;

      case 'w':
        range.minX = -left;

        if (aspectRatio) {
          if (top < container.height - bottom) {
            range.minX = Math.max(range.minX, -top * aspectRatio);
          } else {
            range.minX = Math.max(range.minX, -(container.height - bottom) * aspectRatio);
          }
        }

        if (!this.options.strict && this.options.strictCropBox) {
          range.minX = Math.max(range.minX, canvas.left - left);

          if (aspectRatio) {
            canvas.bottom = canvas.top + canvas.height;

            if (top - canvas.top < canvas.bottom - bottom) {
              range.minX = Math.max(range.minX, -(top - canvas.top) * aspectRatio);
            } else {
              range.minX = Math.max(range.minX, -(canvas.bottom - bottom) * aspectRatio);
            }
          }
        }

        if (range.x < range.minX) {
          range.x = range.minX;
          if (aspectRatio) {
            range.Y = range.x / aspectRatio;
          }
        }

        width -= range.x;
        left += range.x;

        if (aspectRatio) {
          height = width / aspectRatio;
          top += range.Y / 2;
        }

        if (width < 0) {
          dragType = 'e';
          left += width;
          width = -width;
          // todo: recalculate top and height
        }

        break;

      case 's':
        range.maxY = container.height - bottom;

        if (aspectRatio) {
          if (left < container.width - right) {
            range.maxY = Math.min(range.maxY, left * aspectRatio);
          } else {
            range.maxY = Math.min(range.maxY, (container.width - right) * aspectRatio);
          }
        }

        if (!this.options.strict && this.options.strictCropBox) {
          canvas.bottom = canvas.top + canvas.height;
          range.maxY = Math.min(range.maxY, canvas.bottom - bottom);

          if (aspectRatio) {
            canvas.right = canvas.left + canvas.width;

            if (left - canvas.left < canvas.right - right) {
              range.maxY = Math.min(range.maxY, (left - canvas.left) * aspectRatio);
            } else {
              range.maxY = Math.min(range.maxY, (canvas.right - right) * aspectRatio);
            }
          }
        }

        if (range.y > range.maxY) {
          range.y = range.maxY;
          if (aspectRatio) {
            range.X = range.y * aspectRatio;
          }
        }

        height += range.y;

        if (aspectRatio) {
          width = height * aspectRatio;
          left -= range.X / 2;
        }

        if (height < 0) {
          dragType = 'n';
          top += height;
          height = -height;
          // todo: recalculate left and width
        }

        break;

      case 'ne':
        if (aspectRatio) {
          if (range.y <= 0 && (top <= 0 || right >= maxWidth)) {
            console.log('ne invalid');
            renderable = false; // todo: do not just break but recalculate sizes
            break;
          }

          // correction
          if (!this.options.strict && this.options.strictCropBox) {
            // top
            if (top + range.y < canvas.top) {
              range.y = canvas.top - top;
              range.X = range.y * aspectRatio;
            }
          }

          height -= range.y;
          top += range.y;
          width = height * aspectRatio;

          // correction
          if (!this.options.strict && this.options.strictCropBox) {
            // right
            if (left + width > canvas.left + canvas.width) {
              width = canvas.left + canvas.width - left;
              height = width / aspectRatio;
              top = cropBox.top - (height - cropBox.height);
            }
          }
        } else {
          if (range.x >= 0) {
            if (right < maxWidth) {
              // correction
              if (!this.options.strict && this.options.strictCropBox) {
                if (left + width + range.x > canvas.left + canvas.width) {
                  range.x = (canvas.left + canvas.width) - (left + width);
                }
              }
              width += range.x;
            } else if (range.y <= 0 && top <= 0) {
              console.log('ne invalid by X');
              renderable = false; // todo: do not just break but recalculate sizes
            }
          } else {
            width += range.x;
          }

          if (range.y <= 0) {
            if (top > 0) {
              // correction
              if (!this.options.strict && this.options.strictCropBox) {
                // top
                if (top + range.y < canvas.top) {
                  range.y = canvas.top - top;
                }
              }
              height -= range.y;
              top += range.y;
            } {
              console.log('ne invalid by Y');
              // todo: do not just break but recalculate sizes
            }
          } else {
            height -= range.y;
            top += range.y;
          }
        }

        if (width < 0 && height < 0) {
          dragType = 'sw';
          top += height;
          height = -height;
          left += width;
          width = -width;
        } else if (width < 0) {
          dragType = 'nw';
          left += width;
          width = -width;
          // todo: recalculate top and height
        } else if (height < 0) {
          dragType = 'se';
          top += height;
          height = -height;
          // todo: recalculate left and width
        }

        break;

      case 'nw':
        if (aspectRatio) {
          if (range.y <= 0 && (top <= 0 || left <= 0)) {
            console.log('nw invalid');
            renderable = false; // todo: do not just break but recalculate sizes
            break;
          }

          // correction
          if (!this.options.strict && this.options.strictCropBox) {
            // top
            if (top + range.y < canvas.top) {
              range.y = range.Y = canvas.top - top;
              range.x = range.X = range.y * aspectRatio;
            }

            // left
            if (left + range.X < canvas.left) {
              range.x = range.X = canvas.left - left;
              range.y = range.Y = range.x / aspectRatio;
            }
          }

          height -= range.y;
          top += range.y;
          width = height * aspectRatio;
          left += range.X;
        } else {
          if (range.x <= 0) {
            if (left > 0) {
              // correction
              if (!this.options.strict && this.options.strictCropBox) {
                // left
                if (left + range.x < canvas.left) {
                  range.x = canvas.left - left;
                }
              }
              width -= range.x;
              left += range.x;
            } else if (range.y <= 0 && top <= 0) {
              console.log('nw invalid by X');
              renderable = false; // todo: do not just break but recalculate sizes
            }
          } else {
            width -= range.x;
            left += range.x;
          }

          if (range.y <= 0) {
            if (top > 0) {
              // correction
              if (!this.options.strict && this.options.strictCropBox) {
                // top
                if (top + range.y < canvas.top) {
                  range.y = canvas.top - top;
                }
              }

              height -= range.y;
              top += range.y;
            } else {
              console.log('nw invalid by Y');
              // todo: do not just break but recalculate sizes
            }
          } else {
            height -= range.y;
            top += range.y;
          }
        }

        if (width < 0 && height < 0) {
          dragType = 'se';
          top += height;
          height = -height;
          left += width;
          width = -width;
        } else if (width < 0) {
          dragType = 'ne';
          left += width;
          width = -width;
          // todo: recalculate top and height according to new left and width
        } else if (height < 0) {
          dragType = 'sw';
          top += height;
          height = -height;
          // todo: recalculate left and width according to new top and height
        }

        break;

      case 'sw':
        if (aspectRatio) {
          if (range.x <= 0 && (left <= 0 || bottom >= maxHeight)) {
            console.log('sw invalid');
            renderable = false; // todo: do not just break but recalculate sizes
            break;
          }

          // correction
          if (!this.options.strict && this.options.strictCropBox) {
            // left
            if (left + range.x < canvas.left) {
              range.x = range.X = canvas.left - left;
              range.y = range.Y = range.x / aspectRatio;
            }
          }

          width -= range.x;
          left += range.x;
          height = width / aspectRatio;

          // correction
          if (!this.options.strict && this.options.strictCropBox) {
            // height
            if (top + height > canvas.top + canvas.height) {
              height = canvas.top + canvas.height - top;
              width = height * aspectRatio;
              left = cropBox.left - (width - cropBox.width);
            }
          }
        } else {
          if (range.x <= 0) {
            if (left > 0) {
              // correction
              if (!this.options.strict && this.options.strictCropBox) {
                // left
                if (left + range.x < canvas.left) {
                  range.x = canvas.left - left;
                }
              }
              width -= range.x;
              left += range.x;
            } else if (range.y >= 0 && bottom >= maxHeight) {
              console.log('sw invalid by X');
              renderable = false; // todo: do not just break but recalculate sizes
            }
          } else {
            width -= range.x;
            left += range.x;
          }

          if (range.y >= 0) {
            if (bottom < maxHeight) {
              // correction
              if (!this.options.strict && this.options.strictCropBox) {
                // bottom
                if (top + height + range.y > canvas.top + canvas.height) {
                  range.y = canvas.top + canvas.height - height - top;
                }
              }
              height += range.y;
            } else {
              console.log('sw invalid by Y');
              // todo: do not just break but recalculate sizes
            }
          } else {
            height += range.y;
          }
        }

        if (width < 0 && height < 0) {
          dragType = 'ne';
          top += height;
          height = -height;
          left += width;
          width = -width;
        } else if (width < 0) {
          dragType = 'se';
          left += width;
          width = -width;
          // todo: recalculate top and height according to new left and width
        } else if (height < 0) {
          dragType = 'nw';
          top += height;
          height = -height;
          // todo: recalculate left and width according to new top and height
        }

        break;

      case 'se':
        if (aspectRatio) {
          if (range.x >= 0 && (right >= maxWidth || bottom >= maxHeight)) {
            console.log('se invalid');
            renderable = false; // todo: do not just break but recalculate sizes
            break;
          }

          width += range.x;
          height = width / aspectRatio;

          // correction
          if (!this.options.strict && this.options.strictCropBox) {
            // right
            if (left + width > canvas.left + canvas.width) {
              width = canvas.left + canvas.width - left;
              height = width / aspectRatio;
            }

            // height
            if (top + height > canvas.top + canvas.height) {
              height = canvas.top + canvas.height - top;
              width = height * aspectRatio;
            }
          }
        } else {
          if (range.x >= 0) {
            if (right < maxWidth) {
              // correction
              if (!this.options.strict && this.options.strictCropBox) {
                if (left + width + range.x > canvas.left + canvas.width) {
                  range.x = (canvas.left + canvas.width) - (left + width);
                }
              }
              width += range.x;
            } else if (range.y >= 0 && bottom >= maxHeight) {
              console.log('se invalid by X');
              renderable = false; // todo: do not just break but recalculate sizes
            }
          } else {
            width += range.x;
          }

          if (range.y >= 0) {
            if (bottom < maxHeight) {
              // correction
              if (!this.options.strict && this.options.strictCropBox) {
                // bottom
                if (top + height + range.y > canvas.top + canvas.height) {
                  range.y = canvas.top + canvas.height - height - top;
                }
              }
              height += range.y;
            } else {
              console.log('se invalid by Y');
              // todo: do not just break but recalculate sizes
            }
          } else {
            height += range.y;
          }
        }

        if (width < 0 && height < 0) {
          dragType = 'nw';
          top += height;
          height = -height;
          left += width;
          width = -width;
        } else if (width < 0) {
          dragType = 'sw';
          left += width;
          width = -width;
          // todo: recalculate top and height according to new left and width
        } else if (height < 0) {
          dragType = 'ne';
          top += height;
          height = -height;
          // todo: recalculate left and width according to new top and height
        }

        break;

      // Move image
      case 'move':
        this.move(range.x, range.y);
        renderable = false;
        break;

      // Scale image
      case 'zoom':
        this.zoom(function (x1, y1, x2, y2) {
          var z1 = sqrt(x1 * x1 + y1 * y1),
              z2 = sqrt(x2 * x2 + y2 * y2);

          return (z2 - z1) / z1;
        }(
          abs(this.startX - this.startX2),
          abs(this.startY - this.startY2),
          abs(this.endX - this.endX2),
          abs(this.endY - this.endY2)
        ));

        this.endX2 = this.startX2;
        this.endY2 = this.startY2;
        renderable = false;
        break;

      // Crop image
      case 'crop':
        if (range.x && range.y) {
          offset = this.$cropper.offset();
          left = this.startX - offset.left;
          top = this.startY - offset.top;
          width = cropBox.minWidth;
          height = cropBox.minHeight;

          // todo: place correction

          if (range.x > 0) {
            if (range.y > 0) {
              dragType = 'se';
            } else {
              dragType = 'ne';
              top -= height;
            }
          } else {
            if (range.y > 0) {
              dragType = 'sw';
              left -= width;
            } else {
              dragType = 'nw';
              left -= width;
              top -= height;
            }
          }

          // Show the cropBox if is hidden
          if (!this.cropped) {
            this.cropped = true;
            this.$cropBox.removeClass(CLASS_HIDDEN);
          }
        }

        break;

      // No default
    }

    if (renderable) {
      cropBox.width = width;
      cropBox.height = height;
      cropBox.left = left;
      cropBox.top = top;
      this.dragType = dragType;

      this.renderCropBox();
    }

    // Override
    this.startX = this.endX;
    this.startY = this.endY;
  };
