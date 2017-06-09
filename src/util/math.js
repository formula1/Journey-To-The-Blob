var M = {
  quadratic(a, b, c, force){
    var root = b * b - 4 * a * c;
    if(root === 0){
      return [
        -b / (2 * a)
      ]
    }
    if(root > 1){
      root = Math.sqrt(root);
      return [
        (root - b) / (2 * a),
        (-root - b) / (2 * a)
      ];
    }
    if(!force){
      return false;
    }
    root = Math.sqrt(-root);

    var ret = [
      (root - b) / (2 * a),
      (-root - b) / (2 * a)
    ]
    ret.imaginary = true;

    return ret;
  },
  cubic(a, b, c, d, force){
    var p = -b/(3 * a);
    var q = p * p * p + (b * c - 3 * a * d)/(6 * a * a);
    var r = c/(3 * a);

    var root = q * q + Math.pow(r - p * p, 3);
    if(root < 0 && !force){
      return false;
    }
    return (
      Math.pow(q + Math.sqrt(root), 1/3)
      + Math.pow(q - Math.sqrt(root), 1/3)
      + p
    )
  },
  lawOfCos(a, b, c){
    return ( b*b + c*c - a*a)/(2 * c * b);
  },
  areaOfCircleSegment({ slopePoints, offset }, { mid, radius }){
    // x^2 + (mx + b)^2 = r^2
    // x^2 + m^2x^2 + 2 * m * x * b + b ^ 2 = r^2
    // x^2 * (m + 1) + 2 * m * b * x + b ^ 2 - r ^ 2 = 0
    var slope = slopePoints[0] / slopePoints[1];
    var intersections = M.quadratic(
      (slope + 1),
      2 * slope * offset,
      offset * offset - radius * radius
    );
    if(!intersections){
      return 0;
    }
    // full tangent should nothing should be worried about
    if(intersections.length === 1){
      return 0;
    }
    if(slope * mid[0] + offset === mid[1]){
      return 1/2;
    }
    var pointB = [
      intersections[0],
      slope * intersections[0] + offset
    ];
    var pointC = [
      intersections[1],
      slope * intersections[1] + offset
    ];
    var aDist = M.distance(pointB, pointC);
    var bDist = M.distance(pointC, mid);
    var cDist = M.distance(pointB, mid);

    var circleAngel = Math.acos(aDist, bDist, cDist);
    return (circleAngel - Math.sin(circleAngel)) / 2 * radius * radius;
  },
  distance(pointA, pointB){
    return Math.sqrt(
      Math.pow(pointA[0] - pointB[0], 2),
      Math.pow(pointA[1] - pointB[1], 2)
    );
  }
}

module.exports = M;
