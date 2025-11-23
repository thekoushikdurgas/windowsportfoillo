"""
Dependency Injection Container (NestJS-like pattern)
"""
from typing import Dict, Type, TypeVar, Callable
from functools import lru_cache

T = TypeVar('T')


class DependencyContainer:
    """Simple dependency injection container"""
    
    def __init__(self):
        self._services: Dict[Type, any] = {}
        self._factories: Dict[Type, Callable] = {}
    
    def register(self, service_type: Type[T], instance: T = None, factory: Callable[[], T] = None):
        """Register a service"""
        if instance:
            self._services[service_type] = instance
        elif factory:
            self._factories[service_type] = factory
        else:
            raise ValueError("Either instance or factory must be provided")
    
    def get(self, service_type: Type[T]) -> T:
        """Get a service instance"""
        if service_type in self._services:
            return self._services[service_type]
        
        if service_type in self._factories:
            instance = self._factories[service_type]()
            self._services[service_type] = instance
            return instance
        
        raise ValueError(f"Service {service_type} not registered")


# Global container instance
container = DependencyContainer()


def inject(service_type: Type[T]) -> T:
    """Dependency injection decorator/function"""
    return container.get(service_type)

