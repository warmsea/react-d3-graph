"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true,
});
exports.renderGraphDefs = renderGraphDefs;
exports.renderWithBFS = renderWithBFS;

var _react = _interopRequireDefault(require("react"));

var _graph = _interopRequireDefault(require("./graph.const"));

var _marker = require("../marker/marker.const");

var _Link = _interopRequireDefault(require("../link/Link"));

var _Node = _interopRequireDefault(require("../node/Node"));

var _Marker = _interopRequireDefault(require("../marker/Marker"));

var _graph2 = require("./graph.builder");

var _graph3 = require("../graph/graph.helper");

var _collapse = require("./collapse.helper");

var _marker2 = require("../marker/marker.helper");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _nonIterableSpread() {
    throw new TypeError(
        "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
}

function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
    }
    return arr2;
}

function _extends() {
    _extends =
        Object.assign ||
        function(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };
    return _extends.apply(this, arguments);
}

function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly)
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        keys.push.apply(keys, symbols);
    }
    return keys;
}

function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
            ownKeys(Object(source), true).forEach(function(key) {
                _defineProperty(target, key, source[key]);
            });
        } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
            ownKeys(Object(source)).forEach(function(key) {
                Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
            });
        }
    }
    return target;
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
    } else {
        obj[key] = value;
    }
    return obj;
}

/**
 * Function that builds Graph with Breadth First Search.
 * @param {Object.<string, Object>} nodes - an object containing all nodes mapped by their id.
 * @param {Function[]} nodeCallbacks - array of callbacks for used defined event handler for node interactions.
 * @param {Object} config - an object containing rd3g consumer defined configurations {@link #config config} for the graph.
 * @param {string} highlightedNode - this value contains a string that represents the some currently highlighted node.
 * @param {Object} highlightedLink - this object contains a source and target property for a link that is highlighted at some point in time.
 * @param {number} transform - value that indicates the amount of zoom transformation.
 * @param {Array.<Object>} linksMatrix - array of links {@link #Link|Link}.
 * @param {Array.<Object>} links - array of links {@link #Link|Link}.
 * @param {Function[]} linkCallbacks - same as {@link #graphrenderer|linkCallbacks in renderGraph}.
 */
function renderWithBFS(
    nodes,
    nodeCallbacks,
    config,
    highlightedNode,
    highlightedLink,
    transform,
    linksMatrix,
    links,
    linkCallbacks
) {
    function _renderNode(nodeId) {
        var props = (0, _graph2.buildNodeProps)(
            _objectSpread(
                _objectSpread({}, nodes[nodeId]),
                {},
                {
                    id: "".concat(nodeId),
                }
            ),
            config,
            nodeCallbacks,
            highlightedNode,
            highlightedLink,
            transform
        );
        return /*#__PURE__*/ _react["default"].createElement(
            _Node["default"],
            _extends(
                {
                    key: nodeId,
                },
                props
            )
        );
    }

    function _renderLink(link) {
        var source = link.source,
            target = link.target;
        var sourceId = (0, _graph3.getId)(source);
        var targetId = (0, _graph3.getId)(target);
        var key = ""
            .concat(sourceId)
            .concat(_graph["default"].COORDS_SEPARATOR)
            .concat(targetId);
        var props = (0, _graph2.buildLinkProps)(
            _objectSpread(
                _objectSpread({}, link),
                {},
                {
                    source: "".concat(sourceId),
                    target: "".concat(targetId),
                }
            ),
            nodes,
            linksMatrix,
            config,
            linkCallbacks,
            "".concat(highlightedNode),
            highlightedLink,
            transform
        );
        return /*#__PURE__*/ _react["default"].createElement(
            _Link["default"],
            _extends(
                {
                    key: key,
                    id: key,
                },
                props
            )
        );
    }

    var visitedNodeIds = [];
    var visitedLinks = [];
    var elements = [];
    var startNodeId = nodes[Object.keys(nodes)[0]].id;
    elements.push(_renderNode(startNodeId));
    visitedNodeIds.push(startNodeId);
    bfs(elements, visitedNodeIds, visitedLinks, nodes, startNodeId, _renderNode, links, _renderLink);
    return elements;
}

function bfs(elements, visitedNodeIds, visitedLinks, nodes, nodeId, nodeRenderer, links, linkRenderer) {
    if (visitedLinks.length === links.length && visitedNodeIds.length === Object.keys(nodes).length) {
        return;
    }

    var linksToRender = links
        .filter(function(link) {
            return (0, _graph3.getId)(link.source) === nodeId || (0, _graph3.getId)(link.target) === nodeId;
        })
        .filter(function(link) {
            return (
                visitedLinks.filter(function(visitedLink) {
                    return visitedLink.source === link.source && visitedLink.target === link.target;
                }).length === 0
            );
        });
    linksToRender.forEach(function(link) {
        elements.push(linkRenderer(link));
        var connectedNodeId =
            (0, _graph3.getId)(link.source) === nodeId
                ? (0, _graph3.getId)(link.target)
                : (0, _graph3.getId)(link.source);

        if (
            visitedNodeIds.filter(function(visitedNodeId) {
                return visitedNodeId === connectedNodeId;
            }).length === 0
        ) {
            elements.push(nodeRenderer(connectedNodeId));
            visitedNodeIds.push(connectedNodeId);
        }
    });
    visitedLinks.push.apply(visitedLinks, _toConsumableArray(linksToRender));
    var nextLayerNodeIds = linksToRender.map(function(link) {
        return (0, _graph3.getId)(link.source) === nodeId
            ? (0, _graph3.getId)(link.target)
            : (0, _graph3.getId)(link.source);
    });
    nextLayerNodeIds.forEach(function(nodeId) {
        return bfs(elements, visitedNodeIds, visitedLinks, nodes, nodeId, nodeRenderer, links, linkRenderer);
    });
}
/**
 * Builds graph defs (for now markers, but we could also have gradients for instance).
 * NOTE: defs are static svg graphical objects, thus we only need to render them once, the result
 * is cached on the 1st call and from there we simply return the cached jsx.
 * @returns {Function} memoized build definitions function.
 * @memberof Graph/renderer
 */

function _renderDefs() {
    var cachedDefs;
    return function(config) {
        if (cachedDefs) {
            return cachedDefs;
        }

        var _getMarkerSize = (0, _marker2.getMarkerSize)(config),
            small = _getMarkerSize.small,
            medium = _getMarkerSize.medium,
            large = _getMarkerSize.large;

        var markerProps = {
            markerWidth: config.link.markerWidth,
            markerHeight: config.link.markerHeight,
        };
        cachedDefs = /*#__PURE__*/ _react["default"].createElement(
            "defs",
            null,
            /*#__PURE__*/ _react["default"].createElement(
                _Marker["default"],
                _extends(
                    {
                        id: _marker.MARKERS.MARKER_S,
                        refX: small,
                        fill: config.link.color,
                    },
                    markerProps
                )
            ),
            /*#__PURE__*/ _react["default"].createElement(
                _Marker["default"],
                _extends(
                    {
                        id: _marker.MARKERS.MARKER_SH,
                        refX: small,
                        fill: config.link.highlightColor,
                    },
                    markerProps
                )
            ),
            /*#__PURE__*/ _react["default"].createElement(
                _Marker["default"],
                _extends(
                    {
                        id: _marker.MARKERS.MARKER_M,
                        refX: medium,
                        fill: config.link.color,
                    },
                    markerProps
                )
            ),
            /*#__PURE__*/ _react["default"].createElement(
                _Marker["default"],
                _extends(
                    {
                        id: _marker.MARKERS.MARKER_MH,
                        refX: medium,
                        fill: config.link.highlightColor,
                    },
                    markerProps
                )
            ),
            /*#__PURE__*/ _react["default"].createElement(
                _Marker["default"],
                _extends(
                    {
                        id: _marker.MARKERS.MARKER_L,
                        refX: large,
                        fill: config.link.color,
                    },
                    markerProps
                )
            ),
            /*#__PURE__*/ _react["default"].createElement(
                _Marker["default"],
                _extends(
                    {
                        id: _marker.MARKERS.MARKER_LH,
                        refX: large,
                        fill: config.link.highlightColor,
                    },
                    markerProps
                )
            )
        );
        return cachedDefs;
    };
}
/**
 * Memoized reference for _renderDefs.
 * @param  {Object} config - an object containing rd3g consumer defined configurations {@link #config config} for the graph.
 * @returns {Object} graph reusable objects [defs](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/defs).
 * @memberof Graph/renderer
 */

var _memoizedRenderDefs = _renderDefs();
/**
 * Method that actually is exported an consumed by Graph component in order to build all Nodes and Link
 * components.
 * @param  {Object.<string, Object>} nodes - an object containing all nodes mapped by their id.
 * @param  {Function[]} nodeCallbacks - array of callbacks for used defined event handler for node interactions.
 * @param  {Array.<Object>} links - array of links {@link #Link|Link}.
 * @param  {Object.<string, Object>} linksMatrix - an object containing a matrix of connections of the graph, for each nodeId,
 * there is an Object that maps adjacent nodes ids (string) and their values (number).
 * ```javascript
 *  // links example
 *  {
 *     "Androsynth": {
 *         "Chenjesu": 1,
 *         "Ilwrath": 1,
 *         "Mycon": 1,
 *         "Spathi": 1,
 *         "Umgah": 1,
 *         "VUX": 1,
 *         "Guardian": 1
 *     },
 *     "Chenjesu": {
 *         "Androsynth": 1,
 *         "Mycon": 1,
 *         "Spathi": 1,
 *         "Umgah": 1,
 *         "VUX": 1,
 *         "Broodhmome": 1
 *     },
 *     ...
 *  }
 * ```
 * @param  {Function[]} linkCallbacks - array of callbacks for used defined event handler for link interactions.
 * @param  {Object} config - an object containing rd3g consumer defined configurations {@link #config config} for the graph.
 * @param  {string} highlightedNode - this value contains a string that represents the some currently highlighted node.
 * @param  {Object} highlightedLink - this object contains a source and target property for a link that is highlighted at some point in time.
 * @param  {string} highlightedLink.source - id of source node for highlighted link.
 * @param  {string} highlightedLink.target - id of target node for highlighted link.
 * @param  {number} transform - value that indicates the amount of zoom transformation.
 * @returns {Object} returns an object containing the generated nodes and links that form the graph.
 * @memberof Graph/renderer
 */

function renderGraphDefs(config) {
    return _memoizedRenderDefs(config);
}
