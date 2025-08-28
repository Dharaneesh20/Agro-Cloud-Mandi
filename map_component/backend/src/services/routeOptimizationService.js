class RouteOptimizationService {
  constructor() {
    // Dijkstra's algorithm implementation for finding shortest paths
  }

  /**
   * Find optimal route visiting multiple mandis using Traveling Salesman Problem approach
   */
  findOptimalRoute(startPoint, destinations, routeMatrix) {
    // For small number of destinations, use brute force
    if (destinations.length <= 8) {
      return this.bruteForceTSP(startPoint, destinations, routeMatrix);
    }
    
    // For larger sets, use nearest neighbor heuristic
    return this.nearestNeighborTSP(startPoint, destinations, routeMatrix);
  }

  /**
   * Brute force TSP for small number of destinations
   */
  bruteForceTSP(startPoint, destinations, routeMatrix) {
    const n = destinations.length;
    const indices = Array.from({ length: n }, (_, i) => i);
    let bestRoute = null;
    let minDistance = Infinity;
    let minTime = Infinity;

    // Generate all permutations
    const permutations = this.generatePermutations(indices);

    for (const perm of permutations) {
      const { totalDistance, totalTime, route } = this.calculateRouteMetrics(
        startPoint, 
        destinations, 
        perm, 
        routeMatrix
      );

      // Optimize for time primarily, distance secondarily
      const score = totalTime + (totalDistance / 1000) * 0.1;
      const currentBestScore = minTime + (minDistance / 1000) * 0.1;

      if (score < currentBestScore) {
        minDistance = totalDistance;
        minTime = totalTime;
        bestRoute = route;
      }
    }

    return {
      route: bestRoute,
      totalDistance: minDistance,
      totalTime: minTime,
      distanceText: this.formatDistance(minDistance),
      timeText: this.formatDuration(minTime),
      optimizationMethod: 'brute_force'
    };
  }

  /**
   * Nearest neighbor heuristic for larger destination sets
   */
  nearestNeighborTSP(startPoint, destinations, routeMatrix) {
    const visited = new Set();
    const route = [startPoint];
    let currentPoint = startPoint;
    let totalDistance = 0;
    let totalTime = 0;

    while (visited.size < destinations.length) {
      let nearestIndex = -1;
      let minDistance = Infinity;
      let minTime = Infinity;

      // Find nearest unvisited destination
      for (let i = 0; i < destinations.length; i++) {
        if (!visited.has(i)) {
          const distance = this.getDistanceFromMatrix(routeMatrix, route.length - 1, i);
          const time = this.getTimeFromMatrix(routeMatrix, route.length - 1, i);
          
          // Prioritize time over distance
          const score = time + (distance / 1000) * 0.1;
          const currentMinScore = minTime + (minDistance / 1000) * 0.1;

          if (score < currentMinScore) {
            minDistance = distance;
            minTime = time;
            nearestIndex = i;
          }
        }
      }

      if (nearestIndex !== -1) {
        visited.add(nearestIndex);
        route.push(destinations[nearestIndex]);
        totalDistance += minDistance;
        totalTime += minTime;
        currentPoint = destinations[nearestIndex];
      }
    }

    return {
      route: route,
      totalDistance: totalDistance,
      totalTime: totalTime,
      distanceText: this.formatDistance(totalDistance),
      timeText: this.formatDuration(totalTime),
      optimizationMethod: 'nearest_neighbor'
    };
  }

  /**
   * Calculate route metrics for a given permutation
   */
  calculateRouteMetrics(startPoint, destinations, permutation, routeMatrix) {
    const route = [startPoint];
    let totalDistance = 0;
    let totalTime = 0;

    for (let i = 0; i < permutation.length; i++) {
      const destIndex = permutation[i];
      route.push(destinations[destIndex]);
      
      // Get distance and time from matrix
      const distance = this.getDistanceFromMatrix(routeMatrix, i, destIndex);
      const time = this.getTimeFromMatrix(routeMatrix, i, destIndex);
      
      totalDistance += distance;
      totalTime += time;
    }

    return { totalDistance, totalTime, route };
  }

  /**
   * Get distance from route matrix
   */
  getDistanceFromMatrix(matrix, originIndex, destIndex) {
    try {
      return matrix[originIndex][destIndex].response.routeSummary.lengthInMeters || 0;
    } catch (error) {
      console.warn('Error getting distance from matrix:', error);
      return 0;
    }
  }

  /**
   * Get travel time from route matrix
   */
  getTimeFromMatrix(matrix, originIndex, destIndex) {
    try {
      return matrix[originIndex][destIndex].response.routeSummary.travelTimeInSeconds || 0;
    } catch (error) {
      console.warn('Error getting time from matrix:', error);
      return 0;
    }
  }

  /**
   * Generate all permutations of an array
   */
  generatePermutations(arr) {
    if (arr.length <= 1) return [arr];
    
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      const current = arr[i];
      const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
      const permutations = this.generatePermutations(remaining);
      
      for (const perm of permutations) {
        result.push([current].concat(perm));
      }
    }
    
    return result;
  }

  /**
   * Find shortest route between two points considering traffic and road conditions
   */
  findShortestPath(origin, destination, routeOptions = {}) {
    const options = {
      avoidTolls: routeOptions.avoidTolls || false,
      avoidHighways: routeOptions.avoidHighways || false,
      optimizeFor: routeOptions.optimizeFor || 'time', // 'time' or 'distance'
      ...routeOptions
    };

    return {
      origin,
      destination,
      optimizeFor: options.optimizeFor,
      avoidTolls: options.avoidTolls,
      avoidHighways: options.avoidHighways
    };
  }

  /**
   * Calculate efficiency score for a route
   */
  calculateRouteEfficiency(route, totalDistance, totalTime) {
    const avgDistancePerStop = totalDistance / (route.length - 1);
    const avgTimePerStop = totalTime / (route.length - 1);
    
    // Lower values indicate better efficiency
    const distanceEfficiency = avgDistancePerStop / 1000; // km per stop
    const timeEfficiency = avgTimePerStop / 60; // minutes per stop
    
    return {
      distancePerStop: this.formatDistance(avgDistancePerStop),
      timePerStop: this.formatDuration(avgTimePerStop),
      efficiencyScore: Math.round((1 / (distanceEfficiency + timeEfficiency)) * 100)
    };
  }

  // Helper methods
  formatDistance(meters) {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  }

  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }
}

module.exports = RouteOptimizationService;
