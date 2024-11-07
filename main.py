import math


# Tail recursion implementation
def gaussian_blur_tail_recursive(image, kernel, row, col, blurred_image):
  # Base case: If the last row is reached, return the blurred image
  if row == len(image):
    return blurred_image

  # Base case: If the last column of the current row is reached, go to the next row
  if col == len(image[0]):
    return gaussian_blur_tail_recursive(image, kernel, row + 1, 0,
                                        blurred_image)

  # Calculate the blurred value for the current pixel
  blurred_value = 0
  for i in range(len(kernel)):
    for j in range(len(kernel[0])):
      image_row = row - int(len(kernel) / 2) + i
      image_col = col - int(len(kernel[0]) / 2) + j

      if image_row >= 0 and image_row < len(
          image) and image_col >= 0 and image_col < len(image[0]):
        blurred_value += image[image_row][image_col] * kernel[i][j]

  blurred_image[row][col] = blurred_value

  # Recursive call to process the next column
  return gaussian_blur_tail_recursive(image, kernel, row, col + 1,
                                      blurred_image)


# Iterative implementation
def gaussian_blur_iterative(image, kernel):
  blurred_image = [[0 for _ in range(len(image[0]))]
                   for _ in range(len(image))]

  for row in range(len(image)):
    for col in range(len(image[0])):
      blurred_value = 0
      for i in range(len(kernel)):
        for j in range(len(kernel[0])):
          image_row = row - int(len(kernel) / 2) + i
          image_col = col - int(len(kernel[0]) / 2) + j

          if image_row >= 0 and image_row < len(
              image) and image_col >= 0 and image_col < len(image[0]):
            blurred_value += image[image_row][image_col] * kernel[i][j]

      blurred_image[row][col] = blurred_value

  return blurred_image


# Function to initialize the kernel
def create_gaussian_kernel(size, sigma):
  kernel = [[0 for _ in range(size)] for _ in range(size)]

  for i in range(size):
    for j in range(size):
      x = i - int(size / 2)
      y = j - int(size / 2)
      kernel[i][j] = math.exp(-(x**2 + y**2) /
                              (2 * sigma**2)) / (2 * math.pi * sigma**2)

  # Normalize the kernel
  sum = 0
  for i in range(size):
    for j in range(size):
      sum += kernel[i][j]

  for i in range(size):
    for j in range(size):
      kernel[i][j] /= sum

  return kernel


# Example usage:
def example():
  image = [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14, 15],
           [16, 17, 18, 19, 20], [21, 22, 23, 24, 25]]

  kernel_size = 3
  sigma = 1.0
  kernel = create_gaussian_kernel(kernel_size, sigma)
  print*)