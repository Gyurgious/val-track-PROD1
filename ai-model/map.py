import matplotlib.pyplot as plt
import matplotlib.image as mpimg

# Load the map image
map_image_path = './ai-model/sites_image/Sunset_A_Site.png'
map_image = mpimg.imread(map_image_path)

# Example attacker locations (x, y coordinates)
attacker_positions = [(-2065, -9097), (-2742, -5819), (-3547, -9990)]

# Create a new figure
fig, ax = plt.subplots()

# Display the map image
ax.imshow(map_image, extent=[-10000, 12000, -12000, 10000])  # Adjust extent based on the map's coordinate system

# Unpack coordinates for plotting
x_coords, y_coords = zip(*attacker_positions)

# Scatter plot of the attacker positions
ax.scatter(x_coords, y_coords, color='blue', label='Attacker Positions', s=100)

# Customize the plot
plt.title('Most Optimal Position for Attackers in Post-Plant Situation')
plt.xlabel('X Coordinate')
plt.ylabel('Y Coordinate')
plt.axhline(0, color='grey', lw=0.5)
plt.axvline(0, color='grey', lw=0.5)
plt.grid()
plt.legend()

# Show the plot
plt.show()
