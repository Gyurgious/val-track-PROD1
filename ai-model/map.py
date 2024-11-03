import matplotlib.pyplot as plt
import matplotlib.image as mpimg

# Load the map image
map_image_path = './ai-model/sites_image/Sunset_A_Site.png'
map_image = mpimg.imread(map_image_path)

# Example attacker locations (x, y coordinates)
attacker_positions = [(-5225, -1833), (-5000, -2000), (-5500, -1700)]

# Create a new figure
fig, ax = plt.subplots()

# Display the map image
ax.imshow(map_image, extent=[-8000, 8000, -8000, 8000])  # Adjust extent based on the map's coordinate system

# Unpack coordinates for plotting
x_coords, y_coords = zip(*attacker_positions)

# Scatter plot of the attacker positions
ax.scatter(x_coords, y_coords, color='blue', label='Attacker Positions', s=100)

# Customize the plot
plt.title('Attacker Positions During Post-Plant Situations')
plt.xlabel('X Coordinate')
plt.ylabel('Y Coordinate')
plt.axhline(0, color='grey', lw=0.5)
plt.axvline(0, color='grey', lw=0.5)
plt.grid()
plt.legend()

# Show the plot
plt.show()
